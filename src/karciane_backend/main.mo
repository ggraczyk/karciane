import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor Karciane_backend {
  type Game = {
    #Bridge : BridgeGameData;
    #Canasta : CanastaGameData;
  };

  type BridgeGameData = {
    contract: Nat;
    tricks: Nat;
    suit: Text;
    beforeParty: Bool;
    afterParty: Bool;
  };

  type CanastaGameData = {
    redThrees: Nat;
    canastas: Nat;
    cleanCanastas: Nat;
    dirtyCanastas: Nat;
    cardsPoints: Nat;
    meldPoints: Nat;
    finalPoints: Nat;
    onTable: Bool;
    finished: Bool;
  };

  stable var games : [(Text, Game)] = [];
  var gameMap = HashMap.HashMap<Text, Game>(10, Text.equal, Text.hash);

  system func preupgrade() {
    games := gameMap.entries();
  };

  system func postupgrade() {
    gameMap := HashMap.fromIter<Text, Game>(games.vals(), 10, Text.equal, Text.hash);
  };

  public func addGame(pin : Text, gameType : Text) : async Text {
    let existingGame = gameMap.get(pin);
    switch (existingGame) {
      case (?_) { return "PIN " # pin # " już istnieje."; };
      case null {
        switch (gameType) {
          case ("bridge") {
            let initialGame : BridgeGameData = {
              contract = 0;
              tricks = 0;
              suit = "trefl";
              beforeParty = false;
              afterParty = false;
            };
            gameMap.put(pin, #Bridge(initialGame));
            return "PIN " # pin # " dodany dla brydża.";
          };
          case ("canasta") {
            let initialGame : CanastaGameData = {
              redThrees = 0;
              canastas = 0;
              cleanCanastas = 0;
              dirtyCanastas = 0;
              cardsPoints = 0;
              meldPoints = 0;
              finalPoints = 0;
              onTable = false;
              finished = false;
            };
            gameMap.put(pin, #Canasta(initialGame));
            return "PIN " # pin # " dodany dla kanasty.";
          };
          case _ { return "Nieprawidłowy typ gry."; };
        };
      };
    };
  };

  public func updateBridgeGame(pin : Text, contract : Nat, tricks : Nat, suit : Text, beforeParty : Bool, afterParty : Bool) : async Text {
    let game = gameMap.get(pin);
    switch (game) {
      case null { return "PIN " # pin # " nie istnieje."; };
      case (?#Bridge(currentGame)) {
        let updatedGame : BridgeGameData = {
          contract = contract;
          tricks = tricks;
          suit = suit;
          beforeParty = beforeParty;
          afterParty = afterParty;
        };
        gameMap.put(pin, #Bridge(updatedGame));
        return "Dane brydża dla PIN-u " # pin # " zaktualizowane.";
      };
      case _ { return "PIN " # pin # " nie jest grą w brydża."; };
    };
  };

  public func updateCanastaGame(pin : Text, redThrees : Nat, canastas : Nat, cleanCanastas : Nat, dirtyCanastas : Nat, cardsPoints : Nat, meldPoints : Nat, finalPoints : Nat, onTable : Bool, finished : Bool) : async Text {
    let game = gameMap.get(pin);
    switch (game) {
      case null { return "PIN " # pin # " nie istnieje."; };
      case (?#Canasta(currentGame)) {
        let updatedGame : CanastaGameData = {
          redThrees = redThrees;
          canastas = canastas;
          cleanCanastas = cleanCanastas;
          dirtyCanastas = dirtyCanastas;
          cardsPoints = cardsPoints;
          meldPoints = meldPoints;
          finalPoints = finalPoints;
          onTable = onTable;
          finished = finished;
        };
        gameMap.put(pin, #Canasta(updatedGame));
        return "Dane kanasty dla PIN-u " # pin # " zaktualizowane.";
      };
      case _ { return "PIN " # pin # " nie jest grą w kanastę."; };
    };
  };

  public query func getGame(pin : Text) : async ?Game {
    return gameMap.get(pin);
  };
};
