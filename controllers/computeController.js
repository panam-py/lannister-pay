const catchAsync = require("../utils/catchAsync");
const Config = require("../models/configModel");

exports.compute = catchAsync(async (req, res, next) => {
  const amount = req.body.Amount;
  const currency = req.body.Currency;
  const currencyCountry = req.body.CurrencyCountry;
  const paymentEntity = req.body.PaymentEntity;
  const customer = req.body.Customer;

  const configurations = await Config.find();

  let computeLocale;
  const usefulConfigs = [];
  if (paymentEntity.Country === currencyCountry) {
    computeLocale = "LOCL";
  } else {
    computeLocale = "INTL";
  }

  configurations.map((el) => {
    if (
      (el.feeLocale === computeLocale || el.feeLocale === "*") &&
      (el.feeCurrency === currency || el.feeCurrency === "*") &&
      (el.feeEntity === paymentEntity.Type || el.feeEntity === "*") &&
      (el.entityProperty === paymentEntity.Brand || el.entityProperty === "*")
    ) {
      usefulConfigs.push(el);
    }
    //   el.score = 0
    //   console.log(el)
  });

  usefulConfigs.map((el) => {
    if (el.feeLocale === computeLocale) {
      el.score = el.score + 2;
    } else {
      el.score = el.score + 1;
    }

    if (el.feeCurrency === currency) {
      el.score = el.score + 2;
    } else {
      el.score = el.score + 1;
    }

    if (el.entityProperty === paymentEntity.Brand) {
      el.score = el.score + 2;
    } else {
      el.score = el.score + 1;
    }

    if (el.feeEntity === paymentEntity.Type) {
      el.score = el.score + 2;
    } else {
      el.score = el.score + 1;
    }
  });

  let AppliedFeeID, AppliedFeeValue, ChargeAmount, SettlementAmount;
  let percentage, flat;

  if (usefulConfigs.length < 1) {
    return res.status(400).json({
      status: "failed",
      message: "No configuration found for this transaction!",
    });
  } else if (usefulConfigs.length === 1) {
    AppliedFeeID = usefulConfigs[0].feeID;
    if (usefulConfigs[0].feeType === "PERC") {
      percentage = parseFloat(usefulConfigs[0].feeValue);
      AppliedFeeValue = (percentage / 100) * amount;
    } else if (usefulConfigs[0].feeType === "FLAT") {
      flat = parseInt(usefulConfigs[0].feeValue);
      AppliedFeeValue = flat;
    } else if (usefulConfigs[0].feeType === "FLAT_PERC") {
      flat = parseInt(usefulConfigs[0].feeValue.split(":")[0]);
      percentage = parseFloat(usefulConfigs[0].feeValue.split(":")[1]);
      AppliedFeeValue = flat + (percentage / 100) * amount;
    }
  }

  usefulConfigs.sort((a, b) => b.score - a.score);

  AppliedFeeID = usefulConfigs[0].feeID;
  if (usefulConfigs[0].feeType === "PERC") {
    percentage = parseFloat(usefulConfigs[0].feeValue);
    AppliedFeeValue = (percentage / 100) * amount;
  } else if (usefulConfigs[0].feeType === "FLAT") {
    flat = parseInt(usefulConfigs[0].feeValue);
    AppliedFeeValue = flat;
  } else if (usefulConfigs[0].feeType === "FLAT_PERC") {
    flat = parseInt(usefulConfigs[0].feeValue.split(":")[0]);
    percentage = parseFloat(usefulConfigs[0].feeValue.split(":")[1]);
    AppliedFeeValue = flat + (percentage / 100) * amount;
  }

  if (customer.BearsFee === true) {
    ChargeAmount = AppliedFeeValue + amount;
  } else {
    ChargeAmount = amount;
  }

  SettlementAmount = ChargeAmount - AppliedFeeValue;

  res.status(200).json({
    AppliedFeeID,
    AppliedFeeValue,
    ChargeAmount,
    SettlementAmount,
  });
});
