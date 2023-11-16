import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";

import AOS from 'aos';
import "aos/dist/aos.css";

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

        // const build = `${hostUrl}/embed/query/rebecca_thompson_project/order_items?qid=${queryId}&sdk=2&embed_domain=${hostUrl}&sandboxed_host=true`;
        const build = queryUrl;

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
    <Wrapper>{queryUrl ? <Explore ref={embedCtrRef} /> : <div class="position-relative d-flex justify-content-center action"><h2 class="mr-5">I'm getting your query ready!</h2>
    <div class="illustration-holder move">
    <img src="https://mini.bytecode.io/images/ils_05.svg" alt="" class="main-illustration w-100 shape0" />
    <img src="https://mini.bytecode.io/images/ils_05_1.svg" alt="" class="shapes shapeone" />
    <img src="https://mini.bytecode.io/images/ils_05_2.svg" alt="" class="shapes shapetwo aos-init aos-animate" data-aos="fade-up" data-aos-anchor=".fancy-feature-two" data-aos-delay="100" data-aos-duration="2000" />
    <img src="https://mini.bytecode.io/images/ils_05_3.svg" alt="" class="shapes shape-three aos-init aos-animate" data-aos="fade-up" data-aos-anchor=".fancy-feature-two" data-aos-delay="150" data-aos-duration="2000" />
    <img src="https://mini.bytecode.io/images/ils_05_4.svg" alt="" class="shapes shape-four" />
    <img src="https://mini.bytecode.io/images/ils_05_5.svg" alt="" class="shapes shape-five" />
    </div>

    </div>}</Wrapper>
  );
};

export default EmbedTable;
