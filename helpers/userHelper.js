const userCollection = require("../models/userModel");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
require("dotenv").config();
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region: "eu-north-1",
});
const route53 = new AWS.Route53();
var jwt = require("jsonwebtoken");

module.exports = {
  postRegister: async (data) => {
    try {
      console.log(data, "data");
      const { name, email, phone, password } = data;
      const newPassword = await bcrypt.hash(password, 10);
      await userCollection.create({
        name: name,
        email: email,
        phone: phone,
        password: newPassword,
      });

      let token = jwt.sign(
        { name: name, email: email },
        process.env.TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      console.log(token, "token");
      return token;
    } catch (error) {
      console.log("error is", error.message);
      throw error;
    }
  },

  postLogin: async (data) => {
    const { email, password } = data;
    const user = await userCollection.findOne({ email: email });
    if (user) {
      let result = await bcrypt.compare(password, user.password);
      if (result) {
        let token = jwt.sign(
          { name: user.name, email: user.email },
          process.env.TOKEN_SECRET,
          { expiresIn: "10m" }
        );
        console.log(token, "token");
        return token;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  getRecords: (info) => {
    const {id} = info
    return new Promise((resolve, reject) => {
      var params = {
        HostedZoneId: id /* required */,
      };
      route53.listResourceRecordSets(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          console.log(data);
          resolve(data);
        } // successful response
      });
    });
  },

  addRecords: (data) => {
    console.log("data of records to be created", data);
    return new Promise((resolve, reject) => {
      const { name, recordType, value, ttl } = data;
      var params = {
        ChangeBatch: {
          Changes: [
            {
              Action: "CREATE",
              ResourceRecordSet: {
                Name: name,
                ResourceRecords: [
                  {
                    Value: value,
                  },
                ],
                TTL: ttl,
                Type: recordType,
              },
            },
          ],
          Comment: "Web server for example.com",
        },
        HostedZoneId: process.env.HOSTED_ZONE_ID,
      };
      route53.changeResourceRecordSets(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          console.log(data);
          resolve(data);
        } // successful response
      });
    });
  },

  deleteRecord: (data) => {
    console.log("data of records to be created", data);
    return new Promise((resolve, reject) => {
      const { name, recordType, value, ttl } = data;
      console.log();
      var params = {
        ChangeBatch: {
          Changes: [
            {
              Action: "DELETE",
              ResourceRecordSet: {
                Name: name,
                ResourceRecords: value.map((item, index) => ({
                  Value: item.Value,
                })),
                TTL: ttl,
                Type: recordType,
              },
            },
          ],
          Comment: "Web server for example.com",
        },
        HostedZoneId: process.env.HOSTED_ZONE_ID,
      };
      route53.changeResourceRecordSets(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          console.log(data);
          resolve(data);
        } // successful response
      });
    });
  },

  editRecord: (data) => {
    return new Promise((resolve, reject) => {
      const { name, recordType, value, ttl } = data;

      console.log("value", value);
      var params = {
        ChangeBatch: {
          Changes: [
            {
              Action: "UPSERT",
              ResourceRecordSet: {
                Name: name,
                ResourceRecords: value.map((item, index) => ({
                  Value: item.Value,
                })),
                TTL: ttl,
                Type: recordType,
              },
            },
          ],
          Comment: "Web server for example.com",
        },
        HostedZoneId: process.env.HOSTED_ZONE_ID,
      };
      route53.changeResourceRecordSets(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          console.log(data);
          resolve(data);
        } // successful response
      });
    });
  },

  addHostingZone: (info) => {
    const { domainName, type, vpcid, vpcRegion,comment } = info;
    const timeStamp = new Date().getTime().toString();
    

    return new Promise((resolve, reject) => {
      if (type === "PUBLIC") {
        var params = {
          CallerReference: timeStamp /* required */,
          Name: domainName /* required */,
        };
        route53.createHostedZone(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
            console.log(data);
            resolve(data);
          } // successful response
        });
      } else if (type === "PRIVATE") {
        
        var params = {
          CallerReference: timeStamp /* required */,
          Name: domainName /* required */,

          HostedZoneConfig: {
            Comment:comment ,
            PrivateZone: true,
          },
          VPC: {
            VPCId: vpcid,
            VPCRegion: vpcRegion,
          },
        };
        route53.createHostedZone(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log(data); // successful response
        });
      }
    });
  },


  viewHostingZone:(info)=>{
    const {hostingZoneId} = info
    return new Promise((resolve,reject)=>{
        var params = {
            Id: hostingZoneId /* required */
          };
          route53.getHostedZone(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else  
            {
                console.log(data); 
                resolve(data)
            }             // successful response
          });
    })
  }
};
