module deployer::random {
    use std::vector;
    use std::signer;

    use aptos_std::smart_vector;
    use aptos_std::smart_vector::SmartVector;
    use aptos_std::table::{Self, Table};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::coin::Coin;

    const TICKET_PRICE: u64 = 100;

    struct ModuleStore has key {
        total_chickens: u64,
        chicken_price: u64,
        egg_price: u64,
        balances: Table<address, Balance>,
        games: Table<u64 /* game id */, Game>
    }

    struct Balance has store {
        chicken: u64,
        egg: u64
    }
    
    struct Game has store {
        max_position_num: u64,
        min_entry_fee: u64,
        elapse_time: u64,
        bettings: Table<address, Betting>
    }

    struct Betting has store {
        addr: address,
        position: u64,
        amount: u64,
    }

    public fun get_betting_price(): u64 { TICKET_PRICE }

    public(friend) fun new_betting(user: &signer, game_id: u64, position: u64, amount: u64): Betting {
        Betting { 
            addr: signer::address_of(user), 
            position,
            amount
        }
    }

    public fun get_betting_owner(betting: &Betting): address { betting.addr }
    public fun get_betting_position(betting: &Betting): u64 { betting.position }

    public(friend) fun find_and_pay_winners(bettings: &SmartVector<Betting>, coins: &mut Coin<AptosCoin>, number: u64): vector<address> {
        let winners = vector[];
        smart_vector::for_each_ref(bettings, |t| {
            let betting : &Betting = t;
            if (betting.position == number)
                vector::push_back(&mut winners, betting.addr);
        });

        if (!vector::is_empty(&winners)) {
            let prize = coin::value(coins) / vector::length(&winners);
            vector::for_each_ref(&winners, |addr| {
                let coins = coin::extract(coins, prize);
                coin::deposit(*addr, coins);
            });
    };

        winners
    }
}