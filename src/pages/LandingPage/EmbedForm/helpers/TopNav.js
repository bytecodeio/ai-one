import React,{ useContext, useState } from "react";

import { Accordion, Button } from "react-bootstrap";

import { ExtensionContext } from "@looker/extension-sdk-react";


function TopNav(props) {
  const extensionContext = useContext(ExtensionContext);
  const sdk = extensionContext.core40SDK;
  const [show5, setShow5] = React.useState();

  const [navList, setNavList] = useState([])

  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const initialize = async () => {
      let applications = await getApplications(sdk)
      setNavList(applications)
      if (applications.length > 0) {
        let appList = []
        for await (let apps of applications) {
          let tabs = await getApplicationTabs(apps['id'], sdk)
          apps['tabs'] = tabs
          appList.push(apps)
        }
        console.log("sitemap",appList)
        setNavList(appList);
      }
    }
    initialize()
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };

  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShow5(false);
    }
  };

  const handleClick = (app, tab) => {
    let host = extensionContext.extensionSDK.lookerHostData;
    let type = host.hostType == "spartan"? "spartan":"extensions"
    let url = `${host.hostUrl}/${type}/order_express::${app['route']}/${tab['route']}`
    console.log(url)
    extensionContext.extensionSDK.openBrowserWindow(url)
  }

  return (
    <div>
      <div id="slideOut5" className={show5 ? "show" : ""} ref={wrapperRef}>
        <div className="back">
          <div
            id="one5"
            className=""
            role="button"
            tabIndex="0"
            onClick={() => setShow5(true)}
          >
            <p>
        <i class="fal fa-history"></i>
            </p>
          </div>
        </div>

        <div className="modal-content mt-1">
          <div className="modal-header">
            <p className="strong">Chat History</p>
            <div className="closeThisPlease" id="close1">
              <Button
                role="button"
                className="close"
                data-dismiss="modal"
                id="closeThisPlease1"
                onClick={() => setShow5(false)}
              >
                <i className="fal fa-angle-double-left"></i>
              </Button>
            </div>
          </div>
          <div className="modal-body">

          <div class="chat-bubble bot">oh hi! who are you? <p class="small">11:17PM 07/01/23</p></div>

    <div class="chat-bubble bot">oh hi! who are you? how does this work? <p class="small">04:29PM 03/09/23</p></div>
    <div class="chat-bubble bot">I'm locked out of my account. What should I do? <p class="small">04:29PM 03/09/23</p></div>
  <div class="chat-bubble bot">What is Looker Explore? <p class="small">03:20PM 06/24/23</p></div>
      <div class="chat-bubble bot">i want to add cost in inventory items dimension <p class="small">12:02PM 05/22/23</p></div>
        <div class="chat-bubble bot">i want to add average cost measure to my query with a filter more than zero <p class="small">11:17PM 07/01/23</p></div>
        <div class="chat-bubble bot">i want to add Days in Inventory Tier in inventory items dimension <p class="small">04:29PM 03/09/23</p></div>

        <div class="chat-bubble bot">oh hi! who are you? how does this work? <p class="small">04:29PM 03/09/23</p></div>
        <div class="chat-bubble bot">I'm locked out of my account. What shoudl I do? <p class="small">04:29PM 03/09/23</p></div>
      <div class="chat-bubble bot">What is Looker Explore? <p class="small">03:20PM 06/24/23</p></div>
          <div class="chat-bubble bot">i want to add cost in inventory items dimension <p class="small">12:02PM 05/22/23</p></div>
            <div class="chat-bubble bot">i want to add average cost measure <p class="small">11:17PM 07/01/23</p></div>
            <div class="chat-bubble bot">i want to add Days in Inventory Tier in inventory items dimension <p class="small">04:29PM 03/09/23</p></div>



          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
