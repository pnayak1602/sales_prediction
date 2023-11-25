//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ARIMA = require("arima");
const ejs = require("ejs");
const base64Img = require("base64-img");
const docx = require("docx");
const fs = require("fs");
const { SocketAddress } = require("net");
const { ImageRun } = require("docx");
const md5 = require("md5");
const smallIndustries = ["TVS Motor", "Bajaj", "Maruti Suzuki"];
const mediumIndustries = ["Honda India", "BMW", "Tata Motors"];
const largeIndustries = ["Force Motors", "Ashok Leyland", "Mahindra"];
const smallURL = [
  "https://static.theprint.in/wp-content/uploads/2022/02/TVS_-_HD_LOGO2022022312084720220223124712.jpg",
  "https://static.vecteezy.com/system/resources/previews/019/550/773/original/bajaj-editorial-logo-free-download-free-vector.jpg",
  "https://pixlok.com/wp-content/uploads/2021/04/Maruti_Suzuki_logo_PNG.jpg",
];
const mediumURL = [
  "https://images.news18.com/ibnlive/uploads/2022/09/honda-logo-1.jpg",
  "https://freepngimg.com/save/22394-bmw-logo-file/3072x3072",
  "https://i0.wp.com/logotaglines.com/wp-content/uploads/2017/07/tata-motors-logo.jpg?fit=900%2C666&ssl=1",
];
const largeURL = [
  "https://download.logo.wine/logo/Force_Motors/Force_Motors-Logo.wine.png",
  "https://brandslogo.net/wp-content/uploads/2012/10/ashok-leyland-vector-logo.png",
  "https://vectorseek.com/wp-content/uploads/2021/02/Mahindra-Logo-Vector-730x730.jpg",
];
global.user_type = "";
mappings = {
  Honda:
    "https://www.moneycontrol.com/financials/hondaindiapowerproductslimited/results/quarterly-results/HSP02",
  TVS: "https://www.moneycontrol.com/financials/tvsmotorcompany/results/quarterly-results/TVS",
  Force:
    "https://www.moneycontrol.com/financials/forcemotors/results/quarterly-results/FM01",
  Ashok:
    "https://www.moneycontrol.com/financials/ashokleyland/results/quarterly-results/AL",
  Mahindra:
    "https://www.moneycontrol.com/financials/mahindramahindra/results/quarterly-results/MM",
  Bajaj:
    "https://www.moneycontrol.com/financials/bajajauto/results/quarterly-results/BA10",
  Tata: "https://www.moneycontrol.com/financials/tatamotors/results/quarterly-results/TM03",
  BMW: "https://www.moneycontrol.com/financials/bmw-industries-limited/results/quarterly-results/BMW54266",
  Maruti:
    "https://www.moneycontrol.com/financials/marutisuzukiindia/results/quarterly-results/MS24",
};
const mappings2 = {
  Honda: "Honda India",
  TVS: "TVS Motors",
  Force: "Force Motors",
  Ashok: "Ashok Leyland",
  Mahindra: "Mahindra",
  Bajaj: "Bajaj",
  Tata: "TATA Motors",
  BMW: "BMW",
  Maruti: "Maruti Suzuki",
};
global.companyName = "";
global.companyName2 = "";
global.useName = "";
global.predictions = [];
global.predictions2 = [];
const app = express();
var spawn = require("child_process").spawn;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
var flag = 0;

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/adminDB", {
  useNewUrlParser: true,
});
const adminSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  email: String,
  username: String,
  password: String,
});
const Admin = mongoose.model("Admin", adminSchema);
const userSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  email: String,
  username: String,
  password: String,
});
// const admin1 = new Admin({
//   FirstName : 'Admin',
//   LastName : 'Root',
//   email : 'adminRoot@gmail.com',
//   username : 'admin',
//   password : md5('root')
// });
// admin1.save();
const User = mongoose.model("User", userSchema);
// const user1 = new User({
//   FirstName : 'Sannidhi',
//   LastName : 'Shetty',
//   email : 'sannidhiS@gmail.com',
//   username : 'sannidhi',
//   password : md5('root')
// });
// user1.save();
const detailsSchema = new mongoose.Schema({
  companyName: String,
  name: String,
  imgURL: String,
  price: Number,
  specs: {
    type: mongoose.Schema.Types.Mixed,
  },
  knowMoreLink: String,
  reviews: [
    {
      username: String,
      review: String,
    },
  ],
  useName: String,
});
const DisplayDetails = mongoose.model("DisplayDetail", detailsSchema);
console.log("Database Connection successful");

const collectionSchema = new mongoose.Schema({
  "Net Sales/Income from operations": Number,
  "Consumption of Raw Materials": Number,
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});
app.post("/", function (req, res) {
  global.user_type = req.body.user_type;
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  if (global.user_type == "user") {
    User.findOne({ username: username }, function (err, result) {
      if (!err) {
        if (result) {
          if (result.password == password)
            res.sendFile(__dirname + "/cards.html");
          else res.redirect("/");
        } else res.redirect("/");
      } else console.log(err);
    });
  } else {
    Admin.findOne({ username: username }, function (err, result) {
      if (!err) {
        if (result) {
          if (result.password == password)
            res.sendFile(__dirname + "/cards.html");
          else res.redirect("/");
        } else res.redirect("/");
      } else console.log(err);
    });
  }
});

app.get("/index", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.route("/login").get(function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/getInfo", function (req, res) {
  const scaleType = req.body.scaleType;
  if (global.user_type === "admin") {
    if (scaleType === "small") {
      flag = 1;
      res.render("index", { industries: smallIndustries });
    } else if (scaleType === "medium") {
      flag = 2;
      res.render("index", { industries: mediumIndustries });
    } else {
      flag = 3;
      res.render("index", { industries: largeIndustries });
    }
  } else {
    if (scaleType === "small") {
      flag = 1;
      res.render("index2", { industries: smallIndustries, url: smallURL });
    } else if (scaleType === "medium") {
      flag = 2;
      res.render("index2", { industries: mediumIndustries, url: mediumURL });
    } else {
      flag = 3;
      res.render("index2", { industries: largeIndustries, url: largeURL });
    }
  }
});

app.post("/index", function (req, res) {
  console.log("called" + req.body.companyName);
  global.companyName2 = req.body.companyName;
  companyName = mappings[req.body.companyName];
  global.predictions = [];
  // var process2 = spawn('python',["./ScrapeData_Final.py", req.body.companyName, companyName] );
  // process.stdout.on('data', function(data) {
  //     res.send(data.toString());
  // } )
  const collectionName = mongoose.model(
    req.body.companyName + "Detail",
    collectionSchema,
    req.body.companyName + "Details"
  );
  collectionName.find(
    {},
    {
      "Net Sales/Income from operations": 1,
      "Consumption of Raw Materials": 1,
      month: 1,
    },
    function (err, data) {
      // Init arima and start training
      var salesData = [];
      var resourcesData = [];
      // console.log(data);
      for (i = 0; i < data.length; i++) {
        salesData.push(data[i]["Net Sales/Income from operations"]);
        resourcesData.push(data[i]["Consumption of Raw Materials"]);
      }
      const arima = new ARIMA({
        p: 2,
        d: 1,
        q: 2,
        verbose: true,
      }).train(salesData);
      // Predict next 12 values
      const [pred, errors] = arima.predict(12);
      // console.log(pred);
      for (var i = 0; i < pred.length; i++) {
        global.predictions.push(pred[i]);
      }
      const arima2 = new ARIMA({
        p: 2,
        d: 1,
        q: 2,
        verbose: true,
      }).train(resourcesData);
      const [pred2, errors2] = arima2.predict(12);
      // console.log(pred2);
      console.log("Predictions generated.");
      for (var i = 0; i < pred2.length; i++) {
        global.predictions2.push(pred2[i]);
      }
      var process2 = spawn("python", [
        "./generateGraph.py",
        req.body.companyName,
        pred,
      ]);
      // console.log("Here");
      process2.stdout.on("data", function (data2) {
        // res.send(data2.toString());
        // console.log(JSON.stringify(data2));
        res.redirect("/generate-report");
      });
    }
  );
});

app.post("/index-display", function (req, res) {
  console.log("Watch out for this:");
  console.log(req.body);
  const companyName = req.body.companyName;
  DisplayDetails.find({ companyName: companyName }, function (err, result) {
    if (!err) {
      if (result) {
        console.log(result);
        res.render("display", { result: result });
      }
    } else console.log(err);
  });
});

app.post("/view-review", function (req, res) {
  console.log(req.body);
  const companyName = req.body.companyName;
  const useName = req.body.view;
  DisplayDetails.findOne(
    { companyName: companyName, useName: useName },
    { reviews: 1 },
    function (err, result) {
      if (!err) {
        if (result.reviews.length > 0) {
          res.render("view_reviews", { reviewsArray: result.reviews });
        } else {
          res.render("message", {
            message:
              "Sorry!! No review available. Be the first one to give a review!!",
          });
        }
      } else console.log(err);
    }
  );
});

app.post("/write-review", function (req, res) {
  global.companyName = req.body.companyName;
  global.useName = req.body.write;
  console.log("Here : ");
  console.log(req.body);
  res.render("write_review");
  // res.send(req.body);
});

app.post("/new-review", function (req, res) {
  const username = req.body.username;
  const review = req.body.review;
  const obj = {
    username: username,
    review: review,
  };
  console.log(obj);
  console.log(global.companyName + global.useName);
  DisplayDetails.updateOne(
    { companyName: global.companyName, useName: global.useName },
    { $push: { reviews: [obj] } },
    function (err, result) {
      if (!err) {
        console.log("Updated" + JSON.stringify(result));
        res.render("message", {
          message: "Thank you for providing your valuable feedback!",
        });
      } else console.log(err);
    }
  );
});

app.get("/buttons", function (req, res) {
  res.sendFile(__dirname + "/buttons.html");
});

app.get("/cards", function (req, res) {
  res.sendFile(__dirname + "/cards.html");
});
app.get("/utilities-color", function (req, res) {
  res.sendFile(__dirname + "/utilities-color.html");
});
app.get("/utilities-border", function (req, res) {
  res.sendFile(__dirname + "/utilities-border.html");
});
app.get("/utilities-animation", function (req, res) {
  res.sendFile(__dirname + "/utilities-animation.html");
});
app.get("/utilities-other", function (req, res) {
  res.sendFile(__dirname + "/utilities-other.html");
});
app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});
app.post("/register", function (req, res) {
  if (global.user_type == "admin") {
    if (req.body.Password === req.body.repeatPass) {
      const admin = new Admin({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.Password,
      });
      admin.save(function (err) {
        if (!err) {
          console.log("New Admin Inserted successfully");
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  } else {
    if (req.body.Password === req.body.repeatPass) {
      const admin = new User({
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.Password,
      });
      admin.save(function (err) {
        if (!err) {
          console.log("New User Inserted successfully");
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  }
});
app.get("/generate-report", function (req, res) {
  const {
    AlignmentType,
    Document,
    Footer,
    Header,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
    UnderlineType,
    Table,
    TableCell,
    TableRow,
    ImageRun,
  } = docx;
  const image = base64Img.base64Sync(__dirname + "/public/images/myplot.png");
  console.log(global.companyName);
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: mappings2[global.companyName2],
                heading: HeadingLevel.HEADING_6,
                bold: true,
                allCaps: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new ImageRun({
                data: image,
                transformation: {
                  width: 500,
                  height: 400,
                },
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "March 2023 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[0]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[0]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "June 2023 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[1]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[1]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "September 2023 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[2]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[2]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "December 2023 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[3]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[3]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "March 2024 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[4]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[4]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "June 2024 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[5]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[5]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "September 2024 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[6]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[6]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "December 2024 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[7]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[7]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "March 2025 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[8]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[8]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "June 2025 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[9]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[9]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "September 2025 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[10]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[10]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "December 2025 - ",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Net Sales/Income from operations : Rs. (in Cr.) " +
                  String(global.predictions[11]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Expenditure for Consumption of Raw Materials : Rs. (in Cr.) " +
                  String(global.predictions2[11]),
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: " ",
              }),
            ],
          }),
        ],
      },
    ],
  });
  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(__dirname + "/public/files/Document.docx", buffer);
    // res.send(global.predictions);
    res.redirect("/download-report");
  });
});

app.get("/download-report", function (req, res) {
  res.render("download");
});
app.get("/forgot-password", function (req, res) {
  res.sendFile(__dirname + "/forgot-password.html");
});
app.get("/generate", function (req, res) {
  res.send("Generating");
});
app.get("/404", function (req, res) {
  res.sendFile(__dirname + "/404.html");
});
app.get("/charts", function (req, res) {
  res.sendFile(__dirname + "/charts.html");
});
app.get("/tables", function (req, res) {
  res.sendFile(__dirname + "/tables.html");
});
app.listen(3000, function () {
  console.log("Server is up and listening at Port 3000.");
});
