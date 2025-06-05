import { addToast, Button } from "@heroui/react";

type ColorType = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export default function ToastTest() {
  const colors: ColorType[] = ["default", "primary", "secondary", "success", "warning", "danger"];
  
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Button
          key={color}
          color={color}
          variant={"flat"}
          onPress={() =>
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