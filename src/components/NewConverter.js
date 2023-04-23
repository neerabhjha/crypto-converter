import React from "react";
import { useEffect, useState, useRef } from "react";
import { Card, Form, Input, Select, Button } from "antd";
import { BsCurrencyExchange } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";

function NewConverter() {
  const apiUrl = "https://api.coingecko.com/api/v3/exchange_rates";

  const defaultFirstSelectValue = "Bitcoin";
  const defaultSecondSelectValue = "Ether";

  const [cryptoList, setCryptoList] = useState([]);
  const [inputValue, setInputValue] = useState("0");
  const [firstSelect, setFirstSelect] = useState(defaultFirstSelectValue);
  const [secondSelect, setSecondSelect] = useState(defaultSecondSelectValue);
  const [result, setResult] = useState("0");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    cryptoConverter();
  }, [inputValue, firstSelect, secondSelect]);

  //   function which will exchange currencies.
  function cryptoConverter() {
    if (cryptoList.length == 0) return;

    const firstSelectRate = cryptoList.find((item) => {
      return item.value === firstSelect;
    }).rate;

    const secondSelectRate = cryptoList.find((item) => {
      return item.value === secondSelect;
    }).rate;

    const resultValue = (inputValue * secondSelectRate) / firstSelectRate;
    setResult(resultValue.toFixed(4));
  }

  //function to fetch data from API
  async function fetchData() {
    const res = await fetch(apiUrl);
    const resData = await res.json();
    const apiData = resData.rates;
    const tempArr = Object.entries(apiData).map((item) => {
      return {
        value: item[1].name,
        label: item[1].name,
        rate: item[1].value,
      };
    });

    setCryptoList(tempArr);
  }

  function exchangeButton() {
    setFirstSelect(secondSelect);
    setSecondSelect(firstSelect);
  }

  return (
    <div className="container">
      <Card
        className="crypto-card"
        title={
          <h1>
            <BsCurrencyExchange /> Currency Converter Calculator
          </h1>
        }
      >
        <Form size="Large">
          <Form.Item>
            <Input
              className="value-input"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Enter a value you want to change"
            />
          </Form.Item>
        </Form>
        <div className="select-box">
          <Select
            style={{ width: "250px" }}
            defaultValue={defaultFirstSelectValue}
            options={cryptoList}
            onChange={(value) => setFirstSelect(value)}
          />
          <Button
            type="primary"
            icon={<FaExchangeAlt />}
            onClick={() => {
              exchangeButton();
            }}
          />
          <Select
            style={{ width: "250px" }}
            defaultValue={defaultSecondSelectValue}
            options={cryptoList}
            onChange={(value) => setSecondSelect(value)}
          />
        </div>
        <h3>
          {inputValue} {firstSelect} = {result} {secondSelect}
        </h3>
      </Card>
    </div>
  );
}

export default NewConverter;
