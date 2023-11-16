import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";

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

const EmbedTable = ({ queryId, inputValue, setInputValue, handleSearchButton, url, setUrl }) => {
  const { core40SDK: sdk, extensionSDK, extensionContext } = useContext(ExtensionContext);


  console.log("url", url)

//   const [file, setFile] = useState();
//   const [url, setUrl] = useState("")
//
// console.log(inputValue, "this is the input!")
//
//
//
//
// useEffect(() => {
//   const initialize = async () => {
//     let { body } = await extensionContext.extensionSDK.serverProxy(
//       "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1"
//     )
//     setUrl(res);
//
//   };
//   initialize();
// }, []);
//
//




  // useEffect(() => {
  //   const context = extensionSDK.getContextData()
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
  //     console.log("res", res)
  //     setUrl(res);
  //
  //     context.push({
  //       question:inputValue,
  //       url:res,
  //       timestamp:Date.Now()
  //     })
  //     extensionSDK.saveContextData(context)
  //   };
  //   initialize();
  // }, []);
  //






  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl;

      if (el && hostUrl && queryId) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);

        const build = `${hostUrl}/embed/query/rebecca_thompson_project/order_items?qid=${queryId}&sdk=2&embed_domain=${hostUrl}&sandboxed_host=true`

        console.log(build, "it")

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
    <Wrapper>{queryId ? <Explore ref={embedCtrRef} /> : <Spinner />}</Wrapper>
  );
};

export default EmbedTable;
