"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { createClient } from "@/lib/supabase/client";

// Static dummy profiles for quick testing
export const profiles = [
  {
    id: 1,
    username: "Thukuna",
    email: "thukuna@jjk.com",
    password: "iLikeSuckingToeji",
    status: "offline",
  },
  {
    id: 2,
    username: "Suburu",
    email: "suburu@rezero.com",
    password: "WHERE-ARE-THE-STAIRS",
    status: "offline",
  },
  {
    id: 3,
    username: "Miku",
    email: "miku@vocaloid.com",
    password: "VegetableJuice",
    status: "offline",
  },
  {
    id: 4,
    username: "Rabies",
    email: "rabies@disease.com",
    password: "BarkBarkBark",
    status: "offline",
  },
  {
    id: 5,
    username: "Goodboy",
    email: "goodboy@me.com",
    password: "CanIGetSomeCuddles",
    status: "offline",
  },
  {
    id: 6,
    username: "Goodgirl",
    email: "goodgirl@me.com",
    password: "CanIGetSomeHugs",
    status: "offline",
  },
  {
    id: 7,
    username: "Denji",
    email: "denji@csm.com",
    password: "IWonderWhoBallKickingDevilMightBe",
    status: "offline",
  },
];

export type Profile = (typeof profiles)[number];

interface TestSignUpProps {
  selectedProfile: Profile | null;
  onSelectProfile: (profile: Profile | null) => void;
}

export function TestSignUp({
  selectedProfile,
  onSelectProfile,
}: TestSignUpProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleProfileSelect = async (profile: Profile | null) => {
    onSelectProfile(profile);
    if (!profile) return;

    setLoading(true);
    setErrorMessage("");

    // Trying to Log In first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: profile.password,
    });

    if (!signInError) {
      // redirect to app whenever someone login
      router.push("/application");
      router.refresh();
      return;
    }

    // If login fails (user doesn't exist in Supabase yet), automatically Sign Up
    const { error: signUpError } = await supabase.auth.signUp({
      email: profile.email,
      password: profile.password,
      options: {
        data: {
          display_name: profile.username, // Saved to user_metadata
        },
      },
    });

    if (signUpError) {
      setErrorMessage(signUpError.message);
      setLoading(false);
    } else {
      // Retry login after creation
      await supabase.auth.signInWithPassword({
        email: profile.email,
        password: profile.password,
      });
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Combobox
        items={profiles}
        itemToStringValue={(profile: Profile) => profile?.username || ""}
        onValueChange={handleProfileSelect}
      >
        <ComboboxInput
          placeholder={
            loading ? "Authenticating..." : "Search profiles to log in..."
          }
          value={selectedProfile ? selectedProfile.username : ""}
          disabled={loading}
        />
        <ComboboxContent>
          <ComboboxEmpty>No profiles found.</ComboboxEmpty>
          <ComboboxList>
            {(profile) => (
              <ComboboxItem
                key={profile.id}
                value={profile}
                disabled={profile.status === "online" || loading}
                className={`transition-opacity ${
                  profile.status === "online"
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          profile.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {profile.username}
                    </ItemTitle>
                    <ItemDescription className="flex items-center justify-between w-full text-xs">
                      <span className="font-mono">{profile.password}</span>{" "}
                      <span className="text-muted-foreground">
                        ({profile.email})
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {errorMessage && (
        <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
