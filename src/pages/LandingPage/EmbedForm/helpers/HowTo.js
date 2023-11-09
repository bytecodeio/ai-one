import React from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Col,
  Form,
  Row,
} from "react-bootstrap";

function HowTo() {
  return (
    <div>

      <p>
    <span class="ai">Benji</span> is a generative AI tool that can help you utilize the most Looker has to offer. Do you want to build a Looker dashboard? Just ask Benji! Type your questions into the input field and Benji will guide you. You can ask questions or tell Benji what queries to run. Benji will add, remove, update, or delete what you ask them to.
      </p>
    <p class="mt-3">The top navigation icon <span class="ai"><i class="fal fa-moon"></i></span> allows you to toggle to dak mode.</p>

    <p class="mt-3">The top navigation icon <span class="ai"><i class="fal fa-cloud-upload"></i></span> allows you to save your dashboard.</p>


      <p class="mt-3">The left side tab icon <span class="ai"><i class="fal fa-history"></i></span> can be toggled open and you can access the history of your typed questions.</p>


    <p class="mt-3">The right side tab icon <span class="ai"><i class="fal fa-share-square"></i></span> can be toggled open and you can share your Looker dashboard multiple ways.</p>





    </div>
  );
}

export default HowTo;
