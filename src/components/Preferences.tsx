import { useEffect } from "react";

function Preferences() {
  useEffect(() => {
    document.title = `Trega | Настройки`;
  });
  return <>Preferences</>;
}

export default Preferences;
