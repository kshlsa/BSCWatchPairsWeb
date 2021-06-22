import React from "react";
import "./Widgets.css";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";

function Widgets() {
  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder="Search Twitter" type="text" />
      </div>

      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        <TwitterTweetEmbed tweetId={"1399985389725753346"} />

        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="TheCryptoSniper"
          options={{ height: 400 }}
        />

        <TwitterShareButton
          url={"https://www.ambiplatforms.com"}
          options={{ text: "Crypto Market Sniper", via: "Kushal Sanghvi" }}
        />
      </div>
    </div>
  );
}

export default Widgets;
