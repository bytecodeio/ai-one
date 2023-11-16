// import React, {Fragment, useContext, useEffect, useState } from "react";
//
// import { ExtensionContext } from "@looker/extension-sdk-react";
// import { indexOf } from "lodash";
// import { Container, Tab, Tabs, Nav, NavItem, Dropdown, Button, Input, Form, Row, Col } from "react-bootstrap";
//
//
//
// export const GCloud = () => {
//    const extensionContext = useContext(ExtensionContext)
// console.log(inputValue, "this is the input!")
//
//                   const [inputValue, setInputValue] = useState('');
//
//                   const [url, setUrl] = useState("")
//
//
//    useEffect(() => {
//      const initialize = async () => {
//        let res = await extensionContext.extensionSDK.serverProxy(
//          "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
//          {
//            headers: {
//              "Content-type": "application/x-www-form-urlencoded",
//            },
//            method: "POST",
//            body: inputValue,
//          }
//        );
//
//        setUrl(res);
//
//
//      };
//      initialize();
//    },[])
//
//    const handleFolderChange = (v) => {
//      console.log(v)
//      setSelectedFolder(v.target.value)
//      console.log(selectedFolder, "this")
//    }
//
//
//    const handleSubmit = event => {
//      // console.log('handleSubmit ran');
//      event.preventDefault();
//
//      console.log(inputValue)
//       setInputValue(v.target.value)
//      // setInputValue('');
//
//    };
//
//
//
//
//    const submitFile = async () => {
//      const context = extensionSDK.getContextData()
//      const initialize = async () => {
//        let res = await extensionContext.extensionSDK.serverProxy(
//          "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
//          {
//            headers: {
//              "Content-type": "application/x-www-form-urlencoded",
//            },
//            method: "POST",
//            body: inputValue,
//          }
//        );
//
//        console.log("res", res)
//        setUrl(res);
//
//        context.push({
//          question:inputValue,
//          url:res,
//          timestamp:Date.Now()
//        })
//        extensionSDK.saveContextData(context)
//      };
//    }
//
//
//
//   return (
//
//
//     <Fragment>
//
//
//     <input type="text"
//
//     onChange={handleFolderChange}
//     value={inputValue}
//     placeholder="Please enter your question!"/>
//
//     <Button id="gray" onClick={submitFile}><i class="fas fa-upload"></i> enter</Button>
//
//     </Fragment>
//   );
// };
