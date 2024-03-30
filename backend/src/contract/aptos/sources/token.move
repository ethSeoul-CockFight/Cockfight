module deployer::token {
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleStore};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use aptos_std::string_utils;
    use std::bcs;
    use std::option;
    use std::string::{Self, String};

    friend deployer::vault;

    struct Cock has key {}
    struct Egg has key {}

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Token has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
        is_yield: bool,
    }

    #[view]
    public fun total_supply(token: Object<Metadata>): u128 {
        option::get_with_default(&fungible_asset::supply(token), 0)
    }

    public(friend) fun mint(asset: Object<Metadata>, amount: u64, recipient: address) acquires Token {
        let primary_store = ensure_primary_store(recipient, asset);
        let token = borrow_global<Token>(object::object_address(&asset));
        let tokens = fungible_asset::mint(&token.mint_ref, amount);
        fungible_asset::deposit_with_ref(&token.transfer_ref, primary_store, tokens);
    }

    public(friend) fun burn(asset: Object<Metadata>, amount: u64, from: address) acquires Token {
        let primary_store = ensure_primary_store(from, asset);
        let burn_ref = &borrow_global<Token>(object::object_address(&asset)).burn_ref;
        fungible_asset::burn_from(burn_ref, primary_store, amount);
    }

    public(friend) fun transfer(from: address, to: address, asset: Object<Metadata>, amount: u64) acquires Token {
        ensure_primary_store(from, asset);
        ensure_primary_store(to, asset);
        let transfer_ref = &borrow_global<Token>(object::object_address(&asset)).transfer_ref;
        primary_fungible_store::transfer_with_ref(transfer_ref, from, to, amount);
    }

    fun ensure_primary_store(account: address, asset: Object<Metadata>): Object<FungibleStore> acquires Token {
        let store = primary_fungible_store::ensure_primary_store_exists(account, asset);
        let token = borrow_global<Token>(object::object_address(&asset));
        // Prevent standard transfer of yield tokens due to interest accounting.
        if (token.is_yield && !primary_fungible_store::is_frozen(account, asset)) {
            primary_fungible_store::set_frozen_flag(&token.transfer_ref, account, true);
        };
        store
    }

    public (friend) fun create_token(governance: &signer, token_symbol: String, token_name: String, decimals: u8, is_yield: bool): Object<Metadata> {
        let token = &object::create_named_object(governance, bcs::to_bytes(&token_name));
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            token,
            option::none(),
            token_name,
            token_symbol,
            decimals,
            string::utf8(b""),
            string::utf8(b""),
        );

        let token_signer = &object::generate_signer(token);
        move_to(token_signer, Token {
            mint_ref: fungible_asset::generate_mint_ref(token),
            burn_ref: fungible_asset::generate_burn_ref(token),
            transfer_ref: fungible_asset::generate_transfer_ref(token),
            is_yield,
        });
        object::object_from_constructor_ref(token)
    }
}