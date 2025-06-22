import { Button } from "@/components/ui/button";
import { addToast } from "@/utils/toast";

type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export default function ToastTest() {
  const colors: ColorType[] = ["default", "primary", "secondary", "success", "warning", "danger"];
  
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Button
          key={color}
          variant={"outline"}
          onClick={() =>
            addToast({
              title: "Toast title",
              description: "Toast displayed successfully",
              color: color,
            })
          }
        >
          {color.charAt(0).toUpperCase() + color.slice(1)}
        </Button>
      ))}
    </div>
  );
} 