"use client";
import { Button } from "@/components/ui/button";

function getGoogleApiKey() {
  return "AIzaSyBeTdEh3GubP3TJX8Cu2HT70cxRjuRQUfk";
}

const Page = () => {
  async function googletextTobSpeech(
    text: string
  ): Promise<string | undefined> {
    try {
      const apiKey = getGoogleApiKey();
      if (!apiKey || !text) return;

      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

      const data = {
        input: {
          text: text,
        },
        voice: {
          languageCode: "pa-IN",
          name: "pa-IN-Standard-B",
          //   ssmlGender: "MALE",
        },
        audioConfig: {
          audioEncoding: "LINEAR16",
          effectsProfileId: ["small-bluetooth-speaker-class-device"],
          pitch: 0,
          speakingRate: 1,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      console.log(responseJson.audioContent);
      //   const audioBlob = toBlob(responseJson.audioContent, "audio/mpeg");
      //   const audioUrl = URL.createObjectURL(audioBlob);
      //   return audioUrl;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
  return (
    <div>
      <Button
        onClick={() => {
          googletextTobSpeech(
            "ਤੁਸੀਂ ਕਿਵੇਂ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਤੁਸੀਂ ਗੱਡੀ ਚਲਾਉਂਦੇ ਸਮੇਂ ਥੱਕ ਰਹੇ ਹੋ?"
          );
        }}
      >
        Translate
      </Button>
    </div>
  );
};

export default Page;
