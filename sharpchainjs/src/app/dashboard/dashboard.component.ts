import { Component, OnInit } from '@angular/core';
import { Buffer } from "buffer"
import * as curves from "../shared/curves"
import * as crypto from "../shared/crypto_functions"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // const messageHash = Buffer.from("f52c44a5fa08dd6074492a1a3a1e4004e7013bed43c75031a7f138b3cacfad20", "hex")

    for (let i = 0; i < 1; i++) {
      const messageHash = crypto.getRandomBytes(20)
      const privateKey = crypto.getRandomBytes(32)
      // const privateKeyHex = privateKey.toString("hex")
      // const privateKey = Buffer.from("420d0882bbeac75e9e03c1a3c868c037ac87e1c334741b0d31da6c59bf55a893", "hex")
      // const privateKey = Buffer.from("18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725", "hex")
      const expectedFullPublicKey = curves.getFullPublicKey(privateKey)
      const compressedPublicKey = curves.getCompressedPublicKey(privateKey)
      const actualFullPublicKey = curves.getFullPublicKeyFromCompressed(compressedPublicKey)
      // console.log("comp_pub_key:", compressedPublicKey.toString("hex"));

      // console.log(compressedPublicKey.toString("hex"));
      // console.log(expectedFullPublicKey.toString("hex"));
      // console.log(actualFullPublicKey.toString("hex"));
      const isValid = Buffer.compare(expectedFullPublicKey, actualFullPublicKey) == 0
      console.log(isValid);
      if (!isValid) {
        throw "invalid public key, very bad"
      }
      // console.log(isValid)
      const combinedSig = curves.signCombined(messageHash, privateKey)
      // console.log("combined_sig:", combinedSig.toString("hex"));

      const combinedResult = curves.verifyCombined(combinedSig, compressedPublicKey)
      // console.log("isvalid:", combinedResult);
      const length = combinedSig.slice(20).length
      if (!combinedResult) {// || (length != 70 && length != 71 && length != 72)) {
        console.log(length);
        throw "broke"
      }


      // const signatue = curves.sign(messageHash, privateKey)
      // console.log("sig:", signatue.toString("hex"));

      // const result = curves.verify(messageHash, signatue, compressedPublicKey)
      // console.log("isvalid:", result);
    }
    console.log("done");
  }
}