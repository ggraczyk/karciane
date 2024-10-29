import Int16 "mo:base/Int16";
import List "mo:base/List";
//import Hash "mo:base/Hash";
import Array "mo:base/Array";
actor {

type Hand = {
    id : Int16;
    ns : Int16;
    we : Int16;
  };

stable var hands = List.nil<Hand>();
stable var counter: Int16 = 0;



public query func readHands(): async[Hand]{
    // hands.reverse<Hand> (hands);
    // return List.toArray(hands);
    return Array.reverse(List.toArray(hands));
  };

  public func addHand(ns : Int16, we : Int16) : async[Hand]{
    counter := counter + 1;
    let hand : Hand = {id = counter; ns = ns; we = we};
    hands := List.push(hand, hands);
     return Array.reverse(List.toArray(hands));
  };

  public func resetHand() : async Text{
    hands := List.nil<Hand>();
     return "Nowa gra";
  };

  public query func greet(pair1 : Text, pair2 : Text) : async Text {
    return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  };

    public  func zapisz(pair1 : Text, pair2 : Text) : async Text {
    return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  };
};
