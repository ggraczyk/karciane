import Int16 "mo:base/Int16";
import List "mo:base/List";
//import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Int8 "mo:base/Int8";
import Bool "mo:base/Bool";
//import Option "mo:base/Option";

actor {
//tylko PIN

//stable var gamePin: Text = "";


//brydżowe
type Game = {
  pin : Text;
  id : Int16;
  side : Text;
  contractName : Text; // club,diamond,heart,spade
  contractVol : Int8; //1-7 
  tricks : Int8;
 // overtricks : Int8;
 // undertrics : Int8;
  doubled : Bool;
  redoubled : Bool;
  pc : Int8;
  vulnerable : Bool;
};

stable var b_hands = List.nil<Game>();
stable var b_counter: Int16 = 0;



public query func b_readHands(): async[Game]{
    return Array.reverse(List.toArray(b_hands));
  };

  public func b_addHand(gamePin : Text, s : Text, n : Text, v : Int8, t : Int8,  d : Bool, rd : Bool, m : Int8, vulnerable : Bool) : async[Game]{
  // public func b_addHand(conName : Text, conVol : Int8, t : Int8,  d : ?Bool, rd : ?Bool) : async[Game]{
    b_counter := b_counter + 1;
    let b_hand : Game = {pin = gamePin; 
                         id = b_counter; 
                         side = s;
                         contractName = n; 
                         contractVol = v; 
                         tricks = t; 
                      //   overtricks = if (t - ( 6 + v ) > 0)  {t - ( 6 + v )} else 0 ;  
                      //   undertrics = if ( ( 6 + v ) - t > 0)  {( 6 + v ) - t} else 0;
                         doubled = d; //Option.get(d, false) ;//if (Option.get(d, false)) {d} else false ;
                         redoubled = rd; //Option.get(rd, false) ;// if (Option.get(rd, false)) {rd} else false;
                         pc = m;
                         vulnerable = vulnerable;
                         };
    b_hands := List.push(b_hand, b_hands);
     return Array.reverse(List.toArray(b_hands));
  };

  public func b_resetHand() : async Text{
    b_hands := List.nil<Game>();
    b_counter:=0;
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
    pin : Text;
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
//    let all=Array.reverse(List.toArray(hands));
//    let filtrowane = Array.filter<Text>(all, gamePin);
//    return filtrowane;
    };

  public func addHand(ns : Int16, we : Int16, gamePin : Text) : async[Hand]{
    counter := counter + 1;
    let hand : Hand = {pin=gamePin; id = counter; ns = ns; we = we};
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

  public query func getPins() : async Text {
    return "piny gier -   TODO  !";
  };


    public  func zapisz(pair1 : Text, pair2 : Text) : async Text {
    return "ostatni wynik - " # pair1 # ":" # pair2 # "!";
  };
};
