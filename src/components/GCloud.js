import React, {Fragment, useContext, useEffect, useState } from "react";

import { ExtensionContext } from "@looker/extension-sdk-react";
import { indexOf } from "lodash";
import { Container, Tab, Tabs, Nav, NavItem, Dropdown, Button, Input, Form, Row, Col } from "react-bootstrap";



export const GCloud = () => {
  const extensionContext = useContext(ExtensionContext)


  const [inputValue, setInputValue] = useState('');

  const [url, setUrl] = useState("")

  useEffect(() => {
    const initialize = async () => {
      let { res } = await extensionContext.extensionSDK.serverProxy(
        "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1"
      )
      setUrl(res);

    };
    initialize();
  }, []);

  console.log("url", url)

  const handleSubmit =(e) => {
    setInputValue(e.target.value)
  }

  const handleSearchButton = async () => {

    console.log("hisofoi")
    let res = await extensionContext.extensionSDK.serverProxy(
      "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: inputValue,
      }
    );

    console.log("res", res.body)
    setUrl(res.body);



  }





  return (


    <Fragment>

    <input type="text"
    className="form-control"
    onKeyDown={(e) => e.keyCode == "13"? handleSearchButton():''}
    onChange={handleSubmit}
    value={inputValue}
    placeholder="Please enter your question!"/>


    </Fragment>
  );
};
