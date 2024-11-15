import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage/page";
import { Priority } from "@/state/api";

const High = () => {

  return <ReusablePriorityPage priority={Priority.High} />;
};

export default High;