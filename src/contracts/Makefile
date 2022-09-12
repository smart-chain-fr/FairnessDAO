build               :; forge build --names --sizes
buildh              :; forge build --contracts ./contracts
clean               :; forge clean
testq               :; forge test
testd               :; forge test -vvvv
testv               :; forge test -vvvvv
testvg              :; forge test -vvvvv --gas-report
install_ds          :; forge install ds-test
install_op          :; forge install https://github.com/OpenZeppelin/openzeppelin-contracts
lfg                 :; forge clean && forge install && forge build && forge test -vvvvv --gas-report
buidl               :; forge clean && forge test
lcov				:; forge coverage --report lcov && lcov --remove lcov.info 'node_modules/*' 'src/*' -o lcov_parsed.info && genhtml lcov_parsed.info -o report --branch-coverage && open report/index.html
format				:; forge fmt && forge fmt ./contracts/
ci					:; forge fmt --check && forge fmt ./contracts/ --check && make lfg && forge snapshot --check
