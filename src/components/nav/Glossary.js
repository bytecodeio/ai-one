import React, {Fragment, useEffect, useState} from "react";


import { Accordion, AccordionButton, AccordionCollapse, AccordionContext, Alert, Anchor, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Card, CardGroup, CardImg, Carousel, CarouselItem, CloseButton, Col, Collapse, Container, Dropdown, DropdownButton, Fade, Figure, FloatingLabel, Form, FormCheck, FormControl, FormFloating, FormGroup, FormLabel, FormSelect, FormText, Image, InputGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle, Nav, NavDropdown, NavItem, NavLink, Navbar, NavbarBrand, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Overlay, OverlayTrigger, PageItem, Pagination, Placeholder, PlaceholderButton, Popover, PopoverBody, PopoverHeader, ProgressBar, Ratio, Row, SSRProvider, Spinner, SplitButton, Stack, Tab, TabContainer, TabContent, TabPane, Table, Tabs, ThemeProvider, Toast, ToastBody, ToastContainer, ToastHeader, ToggleButton, ToggleButtonGroup, Tooltip} from 'react-bootstrap';

function Glossary() {

  const [message, setMessage] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const screenshotBtn = document.querySelector("#ss-btn"),
      screenshotPreview = document.querySelector(".ss-preview");

  const channel = "C068UG11PKM";
  const botToken = "xoxb-6286112097671-6294021227142-ovwZVkpqm7tr7jicPb0ONJkp";
  const screenCap = () => {
      try{
      const stream = navigator.mediaDevices.getDisplayMedia(),
          video = document.createElement("video");
          video.addEventListener("loadedmetadata", () => {
          const canvas = document.createElement("canvas"),
              canvasCtx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          video.play();
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
          stream.getVideoTracks()[0].stop();

          let dataDownloadUrl = canvas.toDataURL('image/jpeg');
          sendToSlack(dataDownloadUrl);
          let a = document.createElement('a')
          a.setAttribute("id", "d");
          a.href = dataDownloadUrl;
          a.download = 'screenShot.png';
          a.click();
          showButton();
          screenshotPreview.querySelector("img").src = dataDownloadUrl;
          URL.revokeObjectURL(dataDownloadUrl);
      });
      video.srcObject = stream;
    } catch (e) {

      }
  }

  const hideButton = async () => {
      try {
          screenshotBtn.hidden = true;
      } catch (error) {
          screenshotBtn.hidden = false;
      }
  }

  const showButton = () => {
      try {
          screenshotBtn.hidden = false;
      } catch (error) {
          console.log("Button Already Visible");
      }
  }

  const dataURLtoFile = (dUrl, fileName) => {
      let arr = dUrl.split(','),
          mimeType = arr[0].match(/:(.*?);/)[1],
          bStr = atob(arr[arr.length - 1]),
          num = bStr.length,
          u8arr = new Uint8Array(num);
      while(num--){
          u8arr[num] = bStr.charCodeAt(num);
      }
      return new File([u8arr], fileName, {type:mimeType});
  }
  const sendToSlack = async (dataDownloadUrl) => {
      try {
          let mImg = dataURLtoFile(dataDownloadUrl, "screenshot.gif");
          let mData = new FormData();
          mData.append('token', botToken);
          mData.append('channels', channel);
          mData.append('text', 'hello world');
          mData.append('filename', 'screenshot.gif');
          mData.append('filetype', 'gif');
          mData.append('initial_comment', "Here's your data");
          mData.append('title', 'Benji - Data');
          mData.append('file', mImg);

          let xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://slack.com/api/files.upload', true);

          xhr.onload = function () {
              if (xhr.status === 200) {
                  console.log("File Posted");
              } else {
                  alert('There was a problem posting to Slack!');
              }
          };
          xhr.send(mData);
      } catch (error) {
          console.log("Could Not Send");
      }
  }

    return (


<Fragment>

<div class="download-btn-group">
    <div className="ss-preview">
        <div className="screenshot" >
            <a id="ss-btn" onClick={screenCap} class="d-flex tran3s mb-15"><i class="fab fa-slack"></i><span>Share to Slack</span></a>
        </div>
    </div>

<a href="#" class="d-flex tran3s mb-15"><i class="fal fa-envelope"></i><span>Share to Email</span></a>
<a href="#" class="d-flex tran3s mb-15"><i class="fal fa-external-link"></i><span>Share Link</span></a>
</div>

</Fragment>



  )

}

export default Glossary;
