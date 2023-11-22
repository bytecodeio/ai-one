import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";

import AOS from 'aos';
import "aos/dist/aos.css";

import Tilt from 'react-parallax-tilt';

const Explore = styled.div`
  width: 100%;
  min-height: unset;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmbedTable = ({ queryId, queryUrl, inputValue, setInputValue }) => {
  const { core40SDK: sdk, extensionSDK, extensionContext } = useContext(ExtensionContext);

  useEffect(() => {
  AOS.init({
    duration: 1200,
  });
}, []);

  const [file, setFile] = useState();
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (queryUrl !== "") {
      // console.log(queryUrl, "test");
      setUrl(queryUrl);
    }
  }, [queryUrl]);

  // console.log(inputValue, "this is the input!")

  //  const handleSubmit = event => {
  //    console.log('handleSubmit ran');
  //    // event.preventDefault();
  //    //
  //    // console.log(inputValue)
  //     setInputValue(event.target.value)

  //  };

  // useEffect(() => {
  // const context = extensionSDK.getContextData();
  // const initialize = async () => {
  //   let res = await extensionContext.extensionSDK.serverProxy(
  //     "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
  //     {
  //       headers: {
  //         "Content-type": "application/x-www-form-urlencoded",
  //       },
  //       method: "POST",
  //       body: inputValue,
  //     }
  //   );

  //   console.log("res", res);
  //   setUrl(res);

  //   context.push({
  //     question: inputValue,
  //     url: res,
  //     timestamp: Date.Now(),
  //   });
  //   extensionSDK.saveContextData(context);
  // };
  // initialize();
  // }, []);

  //
  // useEffect(() => {
  //   const initialize = async () => {
  //     let res = await extensionContext.extensionSDK.serverProxy(
  //       "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
  //       {
  //         headers: {
  //           "Content-type": "application/x-www-form-urlencoded",
  //         },
  //         method: "POST",
  //         body: inputValue,
  //       }
  //     );
  //
  //     setUrl(res);
  //
  //
  //   };
  //   initialize();
  // }, []);

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl;
      // "https://looker.bytecode.io/embed/query/rebecca_thompson_project/order_items?qid=boIkRy4qlZmA96P5FSuMqH&sdk=2&embed_domain=https://looker.bytecode.io&sandboxed_host=true"
      if (el && hostUrl && queryUrl) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);


        // const build = queryUrl;

        const build = `https://bytecodeef.looker.com/embed/explore/${queryUrl}`





        LookerEmbedSDK.createExploreWithUrl(build)
          .appendTo(el)
          .build()
          .connect()

          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [url]
  );






  return (
    <Wrapper>{queryUrl ? <Explore ref={embedCtrRef} /> :

  <div class="col-lg-5 col-md-12 text-lg-start  funStuff">


<div className="illustration-holder d-inline-block ms-xxl-5 mt-40 lg-mt-10">
<Tilt>
<img src="https://mini.bytecode.io/images/ils_08.svg" alt="" className="transform-img-meta"/>
</Tilt>
<img src="https://mini.bytecode.io/images/ils_08_1.svg" alt="" className="shapes oneShape"/>
</div>

</div>



  }</Wrapper>
  );
};

export default EmbedTable;
