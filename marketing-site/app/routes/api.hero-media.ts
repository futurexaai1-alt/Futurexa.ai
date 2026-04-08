import { data } from "react-router";

export function loader() {
  return data({
    data: {
      mode: "animation",
      videoUrl: "https://cdn.coverr.co/videos/coverr-working-on-code-1873/1080p.mp4"
    }
  });
}
