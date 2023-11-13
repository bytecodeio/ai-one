import React, { useState, useContext, useEffect } from "react";
import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, NavLink, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import "../../../styles.css";
;
import ProductMovement from "./ProductMovement";
import ToTopButton from './ToTopButton.js';
import NavbarMain from "./NavbarMain";
import SideForm from "./helpers/Form.js";
import TopNav from "./helpers/TopNav.js";

import { EmbedExplore } from "../EmbedExplore/EmbedExplore";
import { EmbedMultiExplores } from "../EmbedMultiExplores/EmbedMultiExplores";
import { ExtensionContext } from "@looker/extension-sdk-react";
import { connection, scratch_schema } from "../../../utils/writebackConfig";

export const EmbedForm = ({saveClicked, setSaveClicked}) => {
const { extensionSDK, core40SDK } = useContext(ExtensionContext);
const [message, setMessage] = useState();
const [show, setShow] = useState(false);

    return (
    <>
    <TopNav />
    <NavbarMain/>
      <Container fluid className="mt-50 padding-0">


          <ProductMovement/>

    </Container>


<ToTopButton/>

      <SideForm />

        </>
        )
      };
