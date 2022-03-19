const Config = require("../models/configModel");
const catchAsync = require("../utils/catchAsync");

exports.createConfig = catchAsync(async (req, res, next) => {
  const { FeeConfigurationSpec } = req.body;

  const specs = FeeConfigurationSpec.split("\n");

  await Promise.all(
    specs.map(async (el) => {
      const elArr = el.split(":");
      const elArrSpecs = elArr[0].split(" ");
      // console.log(elArr)
      let elObj,
        feeOptions,
        feeID,
        feeCurrency,
        feeLocale,
        feeEntity,
        entityProperty,
        feeType,
        feeValue;
      
      feeID = elArrSpecs[0];
      feeCurrency = elArrSpecs[1];
      feeLocale = elArrSpecs[2];
      feeEntity = elArrSpecs[3].match(/[^(]*/)[0];
      entityProperty = elArrSpecs[3].match(/\(([^)]+)\)/)[1];
      
      if (elArr.length > 2) {
        feeOptions = `${elArr[1]}:${elArr[2]}`;
        elObj = {
          feeID,
          feeCurrency,
          feeLocale,
          feeEntity,
          entityProperty,
          feeType: feeOptions.split(" ")[2],
          feeValue: feeOptions.split(" ")[3],
        };
        await Config.create(elObj);
      } else {
        feeOptions = `${elArr[1]}`;
        console.log(feeOptions);
        elObj = {
          feeID,
          feeCurrency,
          feeLocale,
          feeEntity,
          entityProperty,
          feeType: feeOptions.split(" ")[2],
          feeValue: feeOptions.split(" ")[3],
        };
        await Config.create(elObj);
      }
    })
  );

  res.status(200).json({
    status: "ok",
  });
});
