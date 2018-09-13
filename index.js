import AWS from "aws-sdk";

/* Make Middleware
import AWS from "aws-sdk";
import { HOC } from "koa-athena"; 
var athena = new AWS.Athena({ apiVersion: "2017-05-18" });
AWS.config.update({ region: process.env.AWS_REGION || "us-west-2" });

*/
export function HOC(QueryString, athena) {
  return async function middleware(ctx) {
    try {
      var params = {
        QueryString,
        ResultConfiguration: {
          /* required */
          OutputLocation: "STRING_VALUE" /* required */,
          EncryptionConfiguration: {
            EncryptionOption: SSE_S3 | SSE_KMS | CSE_KMS /* required */,
            KmsKey: "STRING_VALUE"
          }
        },
        ClientRequestToken: "STRING_VALUE",
        QueryExecutionContext: {
          Database: "STRING_VALUE"
        }
      };
      let result = athena.startQueryExecution(params).promise();
      ctx.body = result;
    } catch (e) {
      console.error(e);
      this.status = 500;
      this.body = "ERROR: " + e;
    }
  };
}

/**
 * var app = new koa();
 * var athena = require("koa-athena");
 * var _ = require("koa-route");
 * app.use(_.get("/get/my-table", athena("select * from my-table")))
 */
export default query =>
  HOC(
    query,
    (() => {
      var athena = new AWS.Athena({ apiVersion: "2017-05-18" });
      AWS.config.update({ region: process.env.AWS_REGION || "us-west-2" });
      return athena;
    })()
  );

