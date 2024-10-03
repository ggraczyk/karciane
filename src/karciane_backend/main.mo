actor {
  public query func greet(pair1 : Text, pair2 : Text) : async Text {
    return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  };
};
