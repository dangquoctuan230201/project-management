import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage/page";
import { Priority } from "@/state/api";

const Urgent = () => {

  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default Urgent;
