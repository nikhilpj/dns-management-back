const userHelper = require("../helpers/userHelper");

module.exports = {
  register: async (req, res) => {
    try {
      console.log(req.body, "registration details");
      let token = await userHelper.postRegister(req.body);
      console.log(token, "in register");

      return res
        .status(200)
        .json({ token: token, message: "registration successfull" });
    } catch (error) {
      console.log("erorr is", error.message);
      return res.status(500).json({ error: "internal server error" });
    }
  },

  login: async (req, res) => {
    console.log(req.body);
    let result = await userHelper.postLogin(req.body);
    if (result) {
      console.log("login successful");
      return res
        .status(200)
        .json({ token: result, message: "login successfull" });
    } else {
      console.log("login unsuccessful");
      return res.status(500).json({ message: "login unsuccessfull" });
    }
  },

  records: async (req, res) => {
    console.log("to get records",req.query);
    let result = await userHelper.getRecords(req.query);
    console.log("results", result);
    return res.status(200).json({ data: result, message: "records retrieved" });
  },

  add: async (req, res) => {
    const result = await userHelper.addRecords(req.body);
    if (result) {
      return res
        .status(200)
        .json({ data: result, message: "records created successfully" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  },

  delete: async (req, res) => {
    console.log("delete ", req.body);
    const result = await userHelper.deleteRecord(req.body);
    if (result) {
      return res.status(200).json({ data: result, message: "record deleted" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  },

  edit: async (req, res) => {
    console.log(req.body);
    let result = await userHelper.editRecord(req.body);
    if (result) {
      return res.status(200).json({ data: result, message: "record upserted" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  },

  hostingZone: async (req, res) => {
    const result = await userHelper.addHostingZone(req.body);
    console.log("result after adding hosting zone", result);
    if (result) {
      return res
        .status(200)
        .json({ data: result, message: "hosting zone created" });
    } else {
      return res.status(500).json({ message: "internal server error" });
    }
  },


  view:async(req,res)=>{
    console.log(req.body)
    const result = await userHelper.viewHostingZone(req.body)
    if(result)
    {
      return res.status(200).json({data:result,message:'details of hosting zone sent'})
    }
    else{
      return res.status(500).json({message:'internal server error'})
    }

  }
};
