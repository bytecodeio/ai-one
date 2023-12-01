import React, { useState, useContext, useEffect, useRef } from "react";
import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, NavLink, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';

import { TypingEffect } from "react-typing-text-effect";

import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

import { LOOKER_MODEL, LOOKER_EXPLORE } from "../../utils/constants";
import { ExtensionContext } from "@looker/extension-sdk-react";
import InnerTableTabs from "../../components/InnerTableTabs";
import Fields from "./helpers/Fields";
import Filters from "./helpers/Filters";
import Rx from "./helpers/Rx";
import QuickFilter from "./helpers/QuickFilter";
import AccountGroups from "./helpers/AccountGroups";
import { DateFilterGroup } from "./helpers/DateFilterGroup";
import { CurrentSelection } from "./helpers/CurrentSelection";
import CurrentAccountGroup from "./helpers/CurrentAccountGroup";
import { DateRangeSelector } from "./helpers/DateRangeSelector";
import EmbedTable from "../../components/EmbedTable";
const Template1 = ({
  currentNavTab,

  selectedFilters,
  setSelectedFilters,
  filterOptions,

  dateFilterOptions,
  fieldOptions,
  isFetchingLookmlFields,
  selectedDateFilter,
  setSelectedDateFilter,
  selectedDateRange,
  setSelectedDateRange,
  dateRange,
  tabKey,
  config,
  showMenu,
  setShowMenu,
  currentInvoiceCount,
  updateInvoiceCount,
  getAllFilters,

  quickFilterOptions,
  quickFilter,
  setQuickFilter,

  setSelectedAccountGroup,
  accountGroupOptions,
  selectedAccountGroup,
  accountGroupField,
  keyword,
  setKeyword,
  handleChangeKeyword,
  url,
}) => {
  const {
    core40SDK: sdk,
    extensionSDK,
    extensionContext,
  } = useContext(ExtensionContext);
  const wrapperRef = useRef(null);
  const [show3, setShow3] = useState();
  const [selectedFields, setSelectedFields] = useState([]);
  const defaultChecked = true;
  const [isDefaultProduct, setIsDefaultProduct] = useState(defaultChecked);
  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [currentInnerTab, setCurrentInnerTab] = useState(0);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [queryUrl, setQueryUrl] = useState("");
    const [showMenu2, setShowMenu2] = useState();
  function handleClearAll() {}

  useEffect(() => {
    if (currentNavTab == tabKey) {
      setIsFilterChanged(true);
      handleTabVisUpdate();
      //slideIt(show3);
    }
  }, [currentNavTab]);

  // Fetch default selected fields and filters + query for embedded visualization from Looker dashboard on load
  const [isFetchingDefaultDashboard, setIsFetchingDefaultDashboard] =
    useState(true);
  useEffect(() => {
    async function fetchDefaultFieldsAndFilters() {
      const { dashboard_elements } = await sdk.ok(
        sdk.dashboard(config.tabbedVis1, "dashboard_elements")
      );

      dashboard_elements?.map((t) => {
        let { client_id } = t["result_maker"]["query"];
        setTabList((prev) => [
          ...prev,
          {
            title: t["title"],
            query: client_id,
            default_fields: [...t.result_maker.query["fields"]],
            selected_fields: [...t.result_maker.query["fields"]],
          },
        ]);
      });

      const { client_id, fields, filters } =
        dashboard_elements[0].result_maker.query;

      setSelectedFields(fields);
      if (filters) setSelectedFilters(filters);
      //setProductMovementVisQid(client_id);
      setIsFetchingDefaultDashboard(false);
    }

    try {
      fetchDefaultFieldsAndFilters();
    } catch (e) {
      console.error("Error fetching default dashboard", e);
    }
  }, []);

  // Fetch the suggestions for each filter field, after fetching all filter fields
  const [isFetchingFilterSuggestions, setIsFetchingFilterSuggestions] =
    useState(true);
  const [filterSuggestions, setFilterSuggestions] = useState({});
  useEffect(() => {
    if (isFetchingLookmlFields || !filterOptions?.length) {
      return;
    }

    function fetchFilterSuggestions(filterFieldName) {
      return sdk.ok(
        sdk.run_inline_query({
          result_format: "json",
          body: {
            model: LOOKER_MODEL,
            view: LOOKER_EXPLORE,
            fields: [filterFieldName],
          },
        })
      );
    }

    async function fetchAllFilterSuggestions() {
      const filterSuggestionPromises = filterOptions.map((filterField) => {
        return fetchFilterSuggestions(filterField.name);
      });
      const filterSuggestionResponses = await Promise.allSettled(
        filterSuggestionPromises
      );

      const filterSuggestionsMap = {};
      filterSuggestionResponses.forEach((response) => {
        // Error handling
        if (response.status !== "fulfilled") {
          // handle rejected failures
          return;
        }
        if (response.value[0].looker_error) {
          console.error(
            "Error fetching suggestions for a Looker filter field ",
            response.value[0].looker_error
          );
          return;
        }

        // Add filter suggestions to map if no errors
        const fieldName = Object.keys(response.value[0])[0];
        const suggestions = response.value.map((row) => row[fieldName]);
        filterSuggestionsMap[fieldName] = suggestions;
      });

      setFilterSuggestions(filterSuggestionsMap);
      setIsFetchingFilterSuggestions(false);
    }

    fetchAllFilterSuggestions();
  }, [filterOptions, isFetchingLookmlFields]);

  // console.log("one", filterSuggestions)

  // Fetch the quick filter suggestions for each filter field
  const [
    isFetchingQuickFilterSuggestions,
    setIsFetchingQuickFilterSuggestions,
  ] = useState(true);
  const [quickFilterSuggestions, setQuickFilterSuggestions] = useState({});
  useEffect(() => {
    if (isFetchingLookmlFields || !quickFilterOptions?.length) {
      return;
    }

    function fetchQuickFilterSuggestions(filterFieldName) {
      return sdk.ok(
        sdk.run_inline_query({
          result_format: "json",
          body: {
            model: LOOKER_MODEL,
            view: LOOKER_EXPLORE,
            fields: [filterFieldName],
          },
        })
      );
    }

    async function fetchAllQuickFilterSuggestions() {
      const quickFilterSuggestionPromises = quickFilterOptions.map(
        (filterField) => {
          return fetchQuickFilterSuggestions(filterField.name);
        }
      );
      const quickFilterSuggestionResponses = await Promise.allSettled(
        quickFilterSuggestionPromises
      );

      const quickFilterSuggestionsMap = {};
      quickFilterSuggestionPromises.forEach((response) => {
        // Error handling
        if (response.status !== "fulfilled") {
          // handle rejected failures
          return;
        }
        if (response.value[0].looker_error) {
          console.error(
            "Error fetching suggestions for a Looker filter field ",
            response.value[0].looker_error
          );
          return;
        }

        // Add filter suggestions to map if no errors
        const fieldName = Object.keys(response.value[0])[0];
        const suggestions = response.value.map((row) => row[fieldName]);
        quickFilterSuggestionsMap[fieldName] = suggestions;
      });

      setQuickFilterSuggestions(quickFilterSuggestionsMap);
      setIsFetchingQuickFilterSuggestions(false);
    }

    fetchAllQuickFilterSuggestions();
  }, [quickFilterOptions, isFetchingLookmlFields]);

  // console.log("two", quickFilterSuggestions)

  // Page loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    if (!isFetchingDefaultDashboard && !isFetchingLookmlFields) {
      setIsPageLoading(false);
    }
  }, [isFetchingDefaultDashboard, isFetchingLookmlFields]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      These are the filters you use to query data. Select the accordions
      individually below to choose the different filter options inside. Once you
      are done you can choose the "Submit Values" button to update the data.
    </Tooltip>
  );

  // Handle run button click
  async function handleTabVisUpdate() {
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    const prevVisQid = currentTab["query"];

    // remove filters with a value of "N/A"
    let filters = {};
    // for (const filter in selectedFilters) {
    //   if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
    //     filters[filter] = selectedFilters[filter];
    //   }
    // }

    // if (selectedDateFilter != "") {
    //   filters[selectedDateFilter] = "Yes";
    // } else {
    //   if (selectedDateRange) {
    //     filters[dateRange["name"]] = selectedDateRange;
    //   }
    // }
    filters = await getAllFilters();

    if (isFilterChanged) {
      updateInnerTabFilters(filters);
    }

    await updateInvoiceCount();

    const { vis_config } = await sdk.ok(sdk.query_for_slug(prevVisQid));

    const { client_id } = await sdk.ok(
      sdk.create_query({
        model: LOOKER_MODEL,
        view: LOOKER_EXPLORE,
        fields: currentTab["selected_fields"],
        filters,
        vis_config,
      })
    );

    tabs[currentInnerTab]["query"] = client_id;
    setTabList(tabs);
  }

  const updateInnerTabFilters = async (filters) => {
    let fullTabList = [...tabList];
    fullTabList.map(async (t, i) => {
      if (i != currentInnerTab) {
        const { vis_config, fields } = await sdk.ok(
          sdk.query_for_slug(t["query"])
        );

        const { client_id } = await sdk.ok(
          sdk.create_query({
            model: LOOKER_MODEL,
            view: LOOKER_EXPLORE,
            fields: fields,
            filters,
            vis_config,
          })
        );

        fullTabList[i]["query"] = client_id;
        setTabList(fullTabList);
      }
    });
    setIsFilterChanged(false);
  };

  async function handleClearAll() {
    console.log("handleClearAll");
    // setIsDefaultProduct(false);
    setUpdateButtonClicked(true);
    setSelectedFields([]);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab["selected_fields"] = [];
    setTabList(tabs);
    let filters = { ...selectedFilters };
    for (let name in filters) {
      filters[name] = "N/A";
    }
    setSelectedFilters(filters);
    // setSelectedFilters((prevFilters) => {
    //   const newFilters = { ...prevFilters };
    //   newFilters[filterName] = 'N/A';
    //   return newFilters;
    // });
    setIsFilterChanged(true);
  }

  async function handleRestoreDefault() {
    setIsDefaultProduct(defaultChecked);
    setUpdateButtonClicked(true);
    let tabs = [...tabList];
    let currentTab = tabs[currentInnerTab];
    currentTab["selected_fields"] = currentTab["default_fields"];
    setTabList(tabs);
  }

  useEffect((e) => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      //setShow3(false);
    }
  };

  const [active, setActive] = useState(false);
  const [faClass, setFaClass] = useState(true);
  const [toggle, setToggle] = useState(true);

  const handleClick = () => {
    setToggle(!toggle);

    setTimeout(() => {
      setActive(!active);

      setFaClass(!faClass);
    }, 600);
  };

  const [slide, setSlide] = React.useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [inputValue, setInputValue] = useState("");


  console.log(inputValue, "input value")

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowMenu2(!showMenu2)
    const context = extensionSDK.getContextData();
    const initialize = async () => {
      let res = await extensionSDK.serverProxy(
        "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
        {
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: `{"inputValue" : "${inputValue}"}`,
        }
      );

      setQueryUrl(res.body)
      console.log(res.body, "this is url")


      context.push({
        question: inputValue,
        url: res,
        timestamp: Date.Now(),
      });
      extensionSDK.saveContextData(context);
    };
    initialize();

  };


  const handleSearchButton = (event) => {
    event.preventDefault();
    setShowMenu2(!showMenu2)
    const context = extensionSDK.getContextData();
    const initialize = async () => {
      let res = await extensionSDK.serverProxy(
        "https://us-central1-ml-accelerator-dbarr.cloudfunctions.net/function-1",
        {
          headers: {
            "Content-type": "application/json",
          },
          method: "POST",
          body: `{"inputValue" : "${inputValue}"}`,
        }
      );

      setQueryUrl(res.body)
      console.log(res.body, "this is url")


      context.push({
        question: inputValue,
        url: res,
        timestamp: Date.Now(),
      });
      extensionSDK.saveContextData(context);
    };
    initialize();

  };






  return (
    <Container fluid>
      <div class="row align-items-center mb-3 mb-5 pb-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
            <span className="bigger text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Hello, I'm <span class="ai">Benji!</span>{" "}
            </span>
            <br></br>
            <TypeAnimation
              sequence={[
                "I am your virtual assistant",
                1000,
                "I harness the power of generative AI",
                1000,
                "I am here to help...",
                1000,
                "Let's explore Looker together!",
                1000,
              ]}
              wrapper="span"
              speed={50}

            />
          </h1>
        </motion.div>
      </div>
      <div className="position-relative fancy-short-banner-five">
        <Container>
          <div class="bg-wrapper mb-5">
            <div class="row align-items-center mb-3">
              <div
                class="col-lg-12 text-center text-lg-start aos-init aos-animate"
                data-aos="fade-right"
              >
                <div class="subscribe-form">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(event) => setInputValue(event.target.value)}
                      value={inputValue}
                      placeholder="Please enter your question!"

                    />
                  <a class="btn-go" onClick={handleSearchButton}>Go!</a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <img
          class="shapes shape-one"
          src="https://sinco.vercel.app/images/shape/shape_10.svg"
        />
        <img
          class="shapes shape-two"
          src="https://sinco.vercel.app/images/shape/shape_11.svg"
        />
      </div>



      <Container>
        <div class="embed-responsive embed-responsive-16by9 small col-lg-12 col-md-12 col-sm-12 explore">
          <EmbedTable
            inputValue={inputValue}
            setInputValue={setInputValue}
            // queryId={"boIkRy4qlZmA96P5FSuMqH"}
            queryUrl={queryUrl}
            showMenu2={showMenu2}
            setShowMenu2={setShowMenu2}
          />
        </div>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <i class="fal fa-times-circle" onClick={handleClose}></i>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <a class="btn-eight" onClick={handleClose}>
            Save
          </a>
          <a class="btn-one" onClick={handleClose}>
            Close
          </a>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Template1;
