import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import PurchasesReview from "./pageTemplates/PurchasesReview/PurchasesReview";
import InflationDeflation from "./pageTemplates/InflationDeflation/InflationDeflation";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import Template1 from "./pageTemplates/Template1/Template1";
import TopNav from "./components/nav/TopNav.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import AOS from 'aos';
import "aos/dist/aos.css";

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "./utils/constants";




import { sortDateFilterList } from "./utils/globalFunctions";

export const Main = ({ inputValue, setInputValue, url }) => {

  useEffect(() => {
  AOS.init({
    duration: 1200,
  });
  }, []);

  const { core40SDK: sdk } = useContext(ExtensionContext);

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);

  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const [dateFilterOptions, setDateFilterOptions] = useState([]);
  const [quickFilterOptions, setQuickFilterOptions] = useState([]);

  const [selectedDateRange, setSelectedDateRange] = useState();

  const [currentInvoiceCount, setCurrentInvoiceCount] = useState("");
  const [selectedAccountGroup, setSelectedAccountGroup] = useState([]);

  const [productMovementFields, setProductMovementFields] = useState([]);
  const [totalInvoiceField, setTotalInvoiceField] = useState();
  const [quickFilter, setQuickFilter] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [accountGroupField, setAccountGroupField] = useState();
  const [dimensionToggleFields, setDimensionToggleFields] = useState({});

  const [dateRange, setDateRange] = useState("");
  const [showMenu, setShowMenu] = useState();
  const [keyword, setKeyword] = useState("");

  const slideIt = (show) => {
    setShowMenu(show);
  };

  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  // Initialize the states
  useEffect(() => {
    function groupFieldsByTags(fields) {
      const fieldsByTag = {};
      fields.forEach((field) => {
        if (field.tags != "") {
          field.tags
            .toString()
            .split(",")
            .forEach((tag) => {
              tag = tag.trim();

              if (fieldsByTag[tag] === undefined) {
                fieldsByTag[tag] = [field];
              } else {
                fieldsByTag[tag].push(field);
              }
            });
        }
      });
      return fieldsByTag;
    }

    const fetchLookmlFields = async () => {
      const response = await sdk.ok(
        sdk.lookml_model_explore(LOOKER_MODEL, LOOKER_EXPLORE, "fields")
      );

      const {
        fields: { dimensions, filters, measures, parameters },
      } = response;

      const lookmlFields = [
        ...dimensions,
        ...filters,
        ...measures,
        ...parameters,
      ];
      const fieldsByTag = groupFieldsByTags(lookmlFields);

      const _filterOptions = fieldsByTag[LOOKML_FIELD_TAGS.filter];

      const _dateFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.date_filter];

      const _productMovementfieldOptions =
        fieldsByTag[LOOKML_FIELD_TAGS.productMovementField];
      const _quickFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.quick_filter];
      // _dimensionToggleFields has the shape { [tag]: field }
      // it gets populated with all the tags that are prefixed with `toggle:`
      const _dimensionToggleFields = Object.fromEntries(
        Object.entries(fieldsByTag).reduce((accumulator, [tag, field]) => {
          if (tag.startsWith(LOOKML_FIELD_TAGS.togglePrefix)) {
            accumulator.push([tag, field]);
          }
          return accumulator;
        }, [])
      );
      if (Object.keys(_dimensionToggleFields).length) {
        setDimensionToggleFields(_dimensionToggleFields);
      }

      let _accountGroupField = undefined;
      try {
        _accountGroupField = fieldsByTag[LOOKML_FIELD_TAGS.accountGroups][0];
      } catch (err) {
        console.error(
          `No account group field using tag ${LOOKML_FIELD_TAGS.accountGroups}`
        );
      }

      //
      // console.log("fieldsByTag", fieldsByTag)
      //
      // console.log('_quickFilterOptions', _quickFilterOptions)

      const _dateRange = fieldsByTag[LOOKML_FIELD_TAGS.dateRange];
      let _totalInvoice = undefined;
      try {
        _totalInvoice = fieldsByTag[LOOKML_FIELD_TAGS.totalInvoices][0];
      } catch (err) {
        console.error(
          `No total invoice field with the tag ${LOOKML_FIELD_TAGS.totalInvoices}`
        );
      }

      let defaultFilterSelections = [];
      try {
        defaultFilterSelections = Object.fromEntries(
          _filterOptions.map((filter) => [filter.name, "N/A"])
        );
      } catch (error) {
        console.error(
          `No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`
        );
      }

      const defaultDateFilterSelections = _dateFilterOptions?.find((filter) => {
        if (filter["suggestions"]) {
          return filter["suggestions"].find((s) => {
            return s.toUpperCase() === "YES";
          });
        }
      });

      const defaultQuickFilterSelections = _quickFilterOptions?.find(
        (filter) => {
          if (filter["suggestions"]) {
            return filter["suggestions"].find((s) => {
              return s.toUpperCase() === "YES";
            });
          }
        }
      );

      if (defaultDateFilterSelections != undefined) {
        setSelectedDateFilter(defaultDateFilterSelections["name"]);
      }

      setSelectedDateRange(getDefaultDateRange());

      if (defaultQuickFilterSelections != undefined) {
        setQuickFilter(defaultQuickFilterSelections["name"]);
      }

      setSelectedDateRange(getDefaultDateRange());

      if (_totalInvoice != undefined) {
        setTotalInvoiceField(_totalInvoice);
        let values = await getValues(_totalInvoice);
        setCurrentInvoiceCount(values[0][_totalInvoice["name"]]);
      }

      if (_filterOptions) {
        setFilterOptions(_filterOptions);
      } else {
        console.error(
          `No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`
        );
      }

      if (_quickFilterOptions) {
        setQuickFilterOptions(_quickFilterOptions);
      } else {
        console.error(
          `No filter options found using tag ${LOOKML_FIELD_TAGS.filter}`
        );
      }

      if (_productMovementfieldOptions) {
        setProductMovementFields(_productMovementfieldOptions);
      } else {
        console.error(
          `No fields found using tag ${LOOKML_FIELD_TAGS.productMovementField}`
        );
      }

      if (_dateFilterOptions) {
        setDateFilterOptions(sortDateFilterList(_dateFilterOptions));
      } else {
        console.error(
          `No date filters found using tag ${LOOKML_FIELD_TAGS.date_filter}`
        );
      }

      if (_accountGroupField != undefined) {
        setAccountGroupField(_accountGroupField);
        let values = await getDefaultValues(_accountGroupField);
        setAccountGroupOptions(
          values.splice(0, 500).map((v, i) => {
            return v[_accountGroupField["name"]];
          })
        );
      }

      setSelectedFilters(defaultFilterSelections);

      setQuickFilter(defaultQuickFilterSelections);

      try {
        setDateRange(_dateRange[0]);
      } catch (error) {
        console.error(
          `No date range found using tag ${LOOKML_FIELD_TAGS.dateRange}`
        );
      }

      setIsFetchingLookmlFields(false);
    };

    try {
      fetchLookmlFields();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  useEffect(() => {}, [selectedDateRange]);

  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  const updateDateRange = async () => {
    let field = { ...dateRange };
    console.log(selectedDateFilter);
    if (selectedDateFilter != "" && Object.keys(field).length > 0) {
      let dateFilterField = dateFilterOptions.find(
        (df) => df["name"] == selectedDateFilter
      );
      console.log("date_filter field", field);
      let filter = {};
      filter[selectedDateFilter] = "Yes";
      console.log(filter);
      const newRange = await sdk.ok(
        sdk.run_inline_query({
          result_format: "json",
          body: {
            model: LOOKER_MODEL,
            view: dateFilterField["view"],
            fields: [field["name"]],
            filters: filter,
            sorts: [field["name"]],
          },
        })
      );
      console.log("new Range", newRange);
      if (newRange.length > 0) {
        let max = newRange.length - 1;
        setSelectedDateRange(
          `${newRange[0][field["name"]]} to ${newRange[max][field["name"]]}`
        );
      }
    }
  };

  const getValues = (field) => {
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: field["view"],
          fields: [field["name"]],
          filters: getAllFilters(),
        },
      })
    );
  };

  const getDefaultValues = (field) => {
    return sdk.ok(
      sdk.run_inline_query({
        result_format: "json",
        body: {
          model: LOOKER_MODEL,
          view: field["view"],
          fields: [field["name"]],
          filters: {},
        },
      })
    );
  };

  const getAllFilters = () => {
    let filters = {};
    for (const filter in selectedFilters) {
      if (selectedFilters[filter] && selectedFilters[filter] !== "N/A") {
        filters[filter] = selectedFilters[filter];
      }
    }

    for (const filter in quickFilter) {
      if (quickFilter[filter] && quickFilter[filter] !== "N/A") {
        filters[filter] = quickFilter[filter];
      }
    }

    if (selectedDateFilter != "") {
      filters[selectedDateFilter] = "Yes";
    } else {
      if (selectedDateRange) {
        filters[dateRange["name"]] = selectedDateRange;
      }
    }

    if (selectedAccountGroup.length > 0) {
      filters[accountGroupField["name"]] = selectedAccountGroup.join(",");
    }
    return filters;
  };

  const updateInvoiceCount = async () => {
    let newCount = await getValues(totalInvoiceField);
    setCurrentInvoiceCount(newCount[0][totalInvoiceField["name"]]);
  };

  useEffect(() => {
    if (selectedDateFilter != "") {
      updateDateRange();
    }
  }, [selectedDateFilter]);

  return (
    <>
      <TopNav />
      <NavbarMain />
      <Container fluid className="mt-50 padding-0">
        <Template1
          inputValue={inputValue}
          setInputValue={setInputValue}
          url={url}
        />
      </Container>

      <ToTopButton />

      <SideForm />
    </>
  );
};
