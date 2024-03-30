module deployer::vault {
    use std::signer;
    use std::string;
    use deployer::token::{Self, Cock, Egg};
    
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::fungible_asset::Metadata;
    use aptos_framework::object::{Self, Object};
    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_std::type_info;
    
    use aptos_std::math64;
    use aptos_framework::aptos_account;

    const COCK_PRICE: u64 = 10_000_000; // 0.1 APT = 1 COCK
    
    /// Cannot deposit into a vault that has expired.
    const EVAULT_HAS_EXPIRED: u64 = 1;
    /// Coin type of deposit is not supported.
    const EUNSUPPORTED_COIN_TYPE: u64 = 2;
    /// Only governance can create a vault.
    const EONLY_GOVERNANCE_CAN_CREATE_VAULT: u64 = 3;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Vault has key {
        underlying_asset: Coin<AptosCoin>, // APT
        principal_token: Object<Metadata>, // COCK

        per_token_interest_at_last_claim: SmartTable<address, u64>,
        interest_claimable: SmartTable<address, u64>,
    }

    public entry fun create_vault_entry(governance: &signer) {
        create_vault(governance);
    }

    public fun create_vault(governance: &signer): Object<Vault> {
        assert!(signer::address_of(governance) == @deployer, EONLY_GOVERNANCE_CAN_CREATE_VAULT);

        let (principal_token) = token::create_token(
            governance,
            coin::symbol<Cock>(),
            string::utf8(b"COCK"),
            coin::decimals<Cock>(),
            false
        );

        let vault_constructor_ref = &object::create_object(@deployer);
        let vault_signer = &object::generate_signer(vault_constructor_ref);
        move_to(vault_signer, Vault {
            underlying_asset: coin::zero(),
            principal_token,

            per_token_interest_at_last_claim: smart_table::new(),
            interest_claimable: smart_table::new(),
        });
        object::object_from_constructor_ref(vault_constructor_ref)
    }

    public entry fun deposit(owner: &signer, vault: Object<Vault>, amount: u64) acquires Vault {
        // Calculate unclaimed interests. This must happen before any deposits.
        let owner_address = signer::address_of(owner);
        let vault = borrow_global_mut<Vault>(object::object_address(&vault));

        let cock = coin::withdraw<AptosCoin>(owner, amount);
        let amount_to_mint = math64::ceil_div(coin::value(&cock), COCK_PRICE);
        coin::merge(&mut vault.underlying_asset, cock);

        token::mint(vault.principal_token, amount_to_mint, owner_address);
    }

    public entry fun redeem(owner: &signer, vault: Object<Vault>, amount: u64) acquires Vault {
        let owner_address = signer::address_of(owner);

        let vault = borrow_global_mut<Vault>(object::object_address(&vault));
        token::burn(vault.principal_token, amount, owner_address);
        distribute(amount, vault, owner_address);
    }

    fun distribute(amount: u64, vault: &mut Vault, recipient: address) {
        let amount_to_redeem = amount * COCK_PRICE;
        let cock_to_redeem = coin::extract(&mut vault.underlying_asset, amount_to_redeem);
        aptos_account::deposit_coins(recipient, cock_to_redeem);
    }

    
    public entry fun deposit_demo(owner: &signer, amount: u64) {
        aptos_account::transfer(owner, @0x1, amount);
    }
    public entry fun redeem_demo(owner: &signer, amount: u64) {}
    public entry fun betting_demo(owner: &signer, position: u64) {}
    public entry fun get_result_demo(owner: &signer, position: u64) {}

    #[test_only]
    use aptos_std::from_bcs;

    #[test(alice = @0x44, core = @0x1)]
    fun test_deposit(alice: &signer, core: &signer){
        // let bob = from_bcs::to_address(x"0000000000000000000000000000000000000000000000000000000000000b0b");
        // let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(core);
        // aptos_account::create_account(signer::address_of(alice));
        // coin::deposit(signer::address_of(alice), coin::mint(10000, &mint_cap));
        // aptos_account::transfer(alice, bob, 500);
        // assert!(coin::balance<AptosCoin>(bob) == 500, 0);
        // assert!(coin::balance<AptosCoin>(bob) == 0, 0);
        deposit_demo(alice, 500);
        // assert!(coin::balance<AptosCoin>(bob) == 500, 0);   
        // coin::destroy_burn_cap(burn_cap);
        // coin::destroy_mint_cap(mint_cap);
    }
}