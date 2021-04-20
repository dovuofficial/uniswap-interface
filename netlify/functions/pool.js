const got = require('got');
const request = require('graphql-request').request;
const gql = require('graphql-request').gql;

exports.handler = async function(event, context) {

    const query = gql`
    {
        pairs(where: { id_in: ["0x54049236fc1db3e274128176efedf7c69b4c6335", "0x3d52401f08dc655b7bbf468bf9f6bdee40c77a2b"] }, orderBy: id, orderDirection: desc ){
          reserveUSD 
       }
      }
    `

    const pair = await request('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', query)

    let output = {};

    try {
        //const ethCG = await got('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum').json();
        //const tapCG = await got('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tapmydata').json();

        output = { statusCode: 200, body:  JSON.stringify(
            { 
                "TAP-ETH": {
                    totalDeposited: Number(pair.pairs[0].reserveUSD),
                    poolRate: "46666",
                    periodFinish: 1619827200 + 7776000
                },
                "TAP-USDT": {
                    totalDeposited:  Number(pair.pairs[1].reserveUSD),
                    poolRate: "46666",
                    periodFinish: 1619827200 + 7776000
                }
             }
        )}
    
    } catch (error) {
        output = {
            statusCode: 500,
            body: error
        }
    }

    return output;
}