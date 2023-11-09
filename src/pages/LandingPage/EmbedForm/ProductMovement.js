
import React, { useState, useContext, useEffect, useRef } from "react";
import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, NavLink, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


import AOS from 'aos';
import "aos/dist/aos.css";
import { TypingEffect } from "react-typing-text-effect";

import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

import "../../../styles.css";

import InnerTableTabs from "./InnerTableTabs";
import CurrentSelections from "./CurrentSelections";
import AccountGroups from "./AccountGroups";
import Pharmacy from "./Pharmacy";
import DateFilters from "./DateFilters";

import Fields from "./helpers/Fields";
import Filters from "./helpers/Filters";

import Collapse1 from "./helpers/Collapse1";

const ProductMovement = () => {

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


  const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.
  </Tooltip>
  );


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
             Hello, I'm <span class="ai">Benji!</span> {" "}
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
             repeat={Infinity}
           />
         </h1>

    </motion.div>
</div>
    <div className="position-relative fancy-short-banner-five">

   <Container>
    <div class="bg-wrapper mb-5">

    <div class="row align-items-center mb-3">


    <div class="col-lg-12 text-center text-lg-start aos-init aos-animate" data-aos="fade-right">
      <div class="subscribe-form">
          <Form>
            <input type="email" placeholder="Please enter your question!"/>

          </Form>

      </div>
    </div>


  </div>

  </div>
</Container>

<img class="shapes shape-one" src="https://sinco.vercel.app/images/shape/shape_10.svg" />
<img class="shapes shape-two" src="https://sinco.vercel.app/images/shape/shape_11.svg"/>


</div>


<Container>
<div class="embed-responsive embed-responsive-16by9 small col-lg-12 col-md-12 col-sm-12 explore">



</div>

</Container>



<Modal show={show} onHide={handleClose}>
  <Modal.Header>
  <i class="fal fa-times-circle"  onClick={handleClose}></i>
    <Modal.Title></Modal.Title>
  </Modal.Header>
  <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
        <a class="btn-eight"   onClick={handleClose}>
           Save
         </a>
         <a class="btn-one"   onClick={handleClose}>
            Close
          </a>

        </Modal.Footer>
      </Modal>
</Container>
)


}


export default ProductMovement;
