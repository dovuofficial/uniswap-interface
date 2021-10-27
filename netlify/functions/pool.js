const got = require('got');
const request = require('graphql-request').request;
const gql = require('graphql-request').gql;

exports.handler = async function(event, context) {

    const query = gql`
    {
        pairs(where: { id_in: ["0x610382c1968aa065a662e34e5a258cc64048324f"] }, orderBy: id, orderDirection: desc ){
          reserveUSD 
       }
      }
    `

    const pair = await request('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', query)

    let output = {};

    try {
        
        output = { statusCode: 200, body:  JSON.stringify(
            { 
                "DOV-ETH": {
                    totalDeposited: Number(pair.pairs[0].reserveUSD),
                    poolRate: "466667",
                    periodFinish: 1635379200 + 15552000
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