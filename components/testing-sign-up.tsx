"use client";

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
    username: "Subaru",
    email: "subaru@rezero.com",
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
  // Purely delegates selection back up to LoginComponent to autofill fields
  const handleProfileSelect = (profile: Profile | null) => {
    onSelectProfile(profile);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Combobox
        items={profiles}
        itemToStringValue={(profile: Profile) => profile?.username || ""}
        onValueChange={handleProfileSelect}
      >
        <ComboboxInput
          placeholder="Search profiles to autofill..."
          value={selectedProfile ? selectedProfile.username : ""}
        />
        <ComboboxContent>
          <ComboboxEmpty>No profiles found.</ComboboxEmpty>
          <ComboboxList>
            {(profile) => (
              <ComboboxItem
                key={profile.id}
                value={profile}
                disabled={profile.status === "online"}
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
    </div>
  );
}
