import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage/page";
import { Priority } from "@/state/api";

const Urgent = () => {
  console.log("sr", Priority)
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default Urgent;
