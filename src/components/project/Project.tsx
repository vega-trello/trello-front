import { useParams } from "react-router";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

function Project() {
  const params = useParams();
  const uuid = params["uuid"] as string;

  useEffect(() => {
    document.title = `Trega | ${uuid}`;
  }, [uuid]);

  return (
    <div id="project">
      <Sidebar />
      <main>{params["uuid"]}</main>
    </div>
  );
}

export default Project;
