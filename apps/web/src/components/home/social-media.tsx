import Facebook from "@/icons/facebook";
import Instagram from "@/icons/instagram";
import Linkedin from "@/icons/linkedin";
import Rss from "@/icons/rss";
import Telegram from "@/icons/telegram";
import Tiktok from "@/icons/tiktok";
import TwitterX from "@/icons/twitter-x";
import Youtube from "@/icons/youtube";
import { Button } from "../ui/button";
import GoogleMaps from "@/icons/google-map";

const socialIcons = {
  facebook: { icon: Facebook },
  twitter: { icon: TwitterX },
  instagram: { icon: Instagram },
  youtube: { icon: Youtube },
  tiktok: { icon: Tiktok },
  rss: { icon: Rss },
  linkedin: { icon: Linkedin },
  telegram: { icon: Telegram },
  googleMap: { icon: GoogleMaps },
};

export interface SocialMediaIconProps {
  platform:
    | "facebook"
    | "twitter"
    | "instagram"
    | "youtube"
    | "tiktok"
    | "rss"
    | "linkedin"
    | "telegram"
    | "googleMap";
  url: string;
}

const SocialMediaIcon = ({ platform, url }: SocialMediaIconProps) => {
  const IconComponent = socialIcons[platform]?.icon;
  if (!IconComponent || !url) return null;

  return (
    <Button className="size-[32px] p-2" asChild>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
      >
        <IconComponent className="size-4 text-txt-black-900" />
      </a>
    </Button>
  );
};

export default SocialMediaIcon;
