import Int16 "mo:base/Int16";
import List "mo:base/List";
//import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Int8 "mo:base/Int8";
import Bool "mo:base/Bool";
import Option "mo:base/Option";

actor {
//brydżowe
type Game = {
  id : Int16;
  contractName : Text; // club,diamond,heart,spade
  contractVol : Int8; //1-7 
  tricks : Int8;
  overtricks : Int8;
  undertrics : Int8;
  doubled : Bool;
  redoubled : Bool;

};

stable var b_hands = List.nil<Game>();
stable var b_counter: Int16 = 0;



public query func b_readHands(): async[Game]{
    return Array.reverse(List.toArray(b_hands));
  };

  public func b_addHand(conName : Text, conVol : Int8, t : Int8,  d : ?Bool, rd : ?Bool) : async[Game]{
    b_counter := b_counter + 1;
    let b_hand : Game = {id = b_counter; 
                         contractName = conName; 
                         contractVol = conVol; 
                         tricks = t; 
                         overtricks = if (t - ( 6 + conVol ) > 0)  {t - ( 6 + conVol )} else 0 ;  
                         undertrics = if ( ( 6 + conVol ) - t > 0)  {( 6 + conVol ) - t} else 0;
                         doubled = Option.get(d, false) ;//if (Option.get(d, false)) {d} else false ;
                         redoubled = Option.get(rd, false) ;// if (Option.get(rd, false)) {rd} else false;
                         };
    b_hands := List.push(b_hand, b_hands);
     return Array.reverse(List.toArray(b_hands));
  };

  public func b_resetHand() : async Text{
    b_hands := List.nil<Game>();
     return "Nowa gra";
  };

  // public query func greet(pair1 : Text, pair2 : Text) : async Text {
  //   return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  // };

  //   public  func zapisz(pair1 : Text, pair2 : Text) : async Text {
  //   return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  // };
///////////////////////////////////////////////////////////////////////////////////////
//kanaściane
///////////////////////////////////////////////////////////////////////////////////////
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
