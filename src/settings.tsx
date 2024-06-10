import { ColorPicker, Popover, Switch } from "@ark-ui/solid";
import { createMemo } from "solid-js";
import { primaryColor, showUi } from "./globals";

const Gear = (props: { size?: number }) => (
  <svg
    width={props.size ?? 24}
    height={props.size ?? 24}
    xmlns="http://www.w3.org/2000/svg"
    fill="inherit"
    stroke="inherit"
    viewBox="-1 0 19 19"
  >
    <path d="M16.014 8.86v1.44a.587.587 0 0 1-.468.556l-1.182.204a.463.463 0 0 1-.114.006 5.902 5.902 0 0 1-.634 1.528.455.455 0 0 1 .078.084l.691.98a.586.586 0 0 1-.062.725l-1.02 1.02a.586.586 0 0 1-.724.061l-.98-.69a.444.444 0 0 1-.085-.078 5.908 5.908 0 0 1-1.544.637.502.502 0 0 1 0 .175l-.182 1.053a.667.667 0 0 1-.633.532h-1.31a.667.667 0 0 1-.633-.532l-.182-1.053a.495.495 0 0 1 0-.175 5.908 5.908 0 0 1-1.544-.637.444.444 0 0 1-.085.077l-.98.691a.586.586 0 0 1-.725-.062l-1.02-1.02a.586.586 0 0 1-.061-.723l.691-.98a.454.454 0 0 1 .077-.085 5.901 5.901 0 0 1-.633-1.528.466.466 0 0 1-.114-.006l-1.182-.204a.586.586 0 0 1-.468-.556V8.86a.586.586 0 0 1 .468-.556L2.636 8.1a.437.437 0 0 1 .114-.005 5.912 5.912 0 0 1 .633-1.528.466.466 0 0 1-.077-.085l-.691-.98a.587.587 0 0 1 .061-.724l1.02-1.02a.587.587 0 0 1 .725-.062l.98.691a.444.444 0 0 1 .085.078 5.903 5.903 0 0 1 1.528-.634.433.433 0 0 1 .005-.114l.204-1.182a.586.586 0 0 1 .556-.468h1.442a.586.586 0 0 1 .556.468l.204 1.182a.448.448 0 0 1 .005.114 5.908 5.908 0 0 1 1.528.634.444.444 0 0 1 .085-.078l.98-.691a.586.586 0 0 1 .724.062l1.02 1.02a.586.586 0 0 1 .062.724l-.691.98a.467.467 0 0 1-.078.085 5.902 5.902 0 0 1 .634 1.528.434.434 0 0 1 .114.005l1.182.204a.587.587 0 0 1 .468.556zm-4.955.72a2.559 2.559 0 1 0-2.56 2.56 2.559 2.559 0 0 0 2.56-2.56z" />
  </svg>
);

const Colors = () => {
  const value = createMemo(() =>
    `rgb(${primaryColor.value.r}, ${primaryColor.value.g}, ${primaryColor.value.b}, 1)`
  );

  return (
    <ColorPicker.Root
      positioning={{ offset: { mainAxis: 32 } }}
      format="rgba"
      value={value()}
      onValueChange={(details) => {
        primaryColor.value = {
          r: details.value.getChannelValue("red"),
          g: details.value.getChannelValue("green"),
          b: details.value.getChannelValue("blue"),
        };
      }}
    >
      <ColorPicker.Context>
        {(api) => (
          <>
            <div class="flex items-center space-x-2">
              <ColorPicker.Control>
                <ColorPicker.Trigger class="cursor-pointer w-6 h-6 rounded-full overflow-clip ">
                  <ColorPicker.Swatch
                    class="w-full h-full"
                    value={api().value}
                  />
                </ColorPicker.Trigger>
              </ColorPicker.Control>
              <ColorPicker.Label class="font-display uppercase">
                Color
              </ColorPicker.Label>
            </div>
            <ColorPicker.Positioner>
              <ColorPicker.Content class="w-48 h-48 flex space-x-2 p-4 rounded-lg bg-gray-500/50 border border-primary-100/50 before:backdrop-hack backdrop-blur-2xl">
                <ColorPicker.Area class="w-full h-full">
                  <ColorPicker.AreaBackground class="w-full h-full" />
                  <ColorPicker.AreaThumb class="w-4 h-4 border-2 border-primary-100 rounded-full" />
                </ColorPicker.Area>
                <ColorPicker.ChannelSlider
                  channel="hue"
                  orientation="vertical"
                  class="h-full w-4"
                >
                  <ColorPicker.ChannelSliderTrack class="w-full h-full" />
                  <ColorPicker.ChannelSliderThumb class="w-4 h-4 -translate-x-2 border-2 border-primary-100 rounded-full" />
                </ColorPicker.ChannelSlider>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </>
        )}
      </ColorPicker.Context>
      <ColorPicker.HiddenInput />
    </ColorPicker.Root>
  );
};

export default () => {
  return (
    <Popover.Root positioning={{ offset: { mainAxis: 32 } }}>
      <Popover.Trigger class="cursor-pointer">
        <Gear size={28} />
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="bg-gray-500/50 backdrop-blur-xl rounded-lg p-4 border border-primary-100/50 space-y-4">
          <Switch.Root
            checked={showUi.value}
            onCheckedChange={(e) => showUi.value = e.checked}
            class="flex items-center space-x-2"
          >
            <Switch.Control class="cursor-pointer inline-block w-12 h-6 rounded-full bg-primary-100/50 data-[state=checked]:bg-primary-100  transition">
              <Switch.Thumb class="inline-block bg-primary-600 w-6 h-6 rounded-full data-[state=checked]:translate-x-6 transition" />
            </Switch.Control>
            <Switch.Label class="font-display uppercase">Show UI</Switch.Label>
            <Switch.HiddenInput />
          </Switch.Root>
          <Colors />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
