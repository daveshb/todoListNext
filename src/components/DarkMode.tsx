import { ContextGlobal } from "@/context/Context";
import { Label, Switch } from "@heroui/react";
import { useContext } from "react";

export const DarkMode = () => {
  const { isSelected, setIsSelected } = useContext(ContextGlobal);

  return (
    <div className="p-2 border">
      <div className="text-black">Titulo</div>

      <Switch isSelected={isSelected} onChange={setIsSelected}>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Content>
          <Label className="text-sm text-black">DarkMode</Label>
        </Switch.Content>
      </Switch>

      {isSelected ? <div className="text-blue-800">Imagen de luna</div> : <div className="text-green-500">imagen de un sol</div>}
    </div>
  );
};
