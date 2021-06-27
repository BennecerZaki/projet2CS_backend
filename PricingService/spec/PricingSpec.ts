import { response } from "express";
import "jasmine";
import { RentalPenalty } from "../src/entity/RentalPenalty";
import { Penalty } from "../src/entity/Penalty";
import PricingController = require('../src/controllers/PricingController')
import PromoCodeController = require('../src/controllers/PromoCodeController')
import app,{server} from '../src/index';

var request = require("supertest");


describe("Pricing Test Suite", function() {    
    describe("test difference in hours", function() {
        it("should return 0 hours", function() {
            expect(PricingController.getDifferenceInHours(
                new Date('2021-03-04'),new Date('2021-03-04'))).toEqual(0);
        });
    })
    describe("test difference in hours", function() {
        it("should return 6 hours", function() {
            expect(PricingController.getDifferenceInHours(
                new Date(2021,3,4,14),new Date(2021,3,4,20,45))).toEqual(7);
        }); 
    })
    describe("test difference in hours", function() {
        it("should return 30 hours", function() {
            expect(PricingController.getDifferenceInHours(
                new Date(2021,3,4,14),new Date(2021,3,5,20))).toEqual(30);
        }); 
    })
    describe("test price from unit price and duration", function() {
        it("should return 6000", function() {
            expect(PricingController.calculateBasePrice(3000,3)).toEqual(9000);
        }); 
    })
    describe("test price from unit price and duration", function() {
        it("should return 1000", function() {
            expect(PricingController.calculateBasePrice(1000,1)).toEqual(1000);
        }); 
    })
    describe("test price from unit price and duration", function() {
        it("should return the mssg Error", function() {
            expect(PricingController.calculateBasePrice(1000,-1)).toEqual({msg : "Error"});
        }); 
    })
    describe("test price reduction", function() {
        it("should return price with a 10% reduction", function() {
            expect(PromoCodeController.calculateReduction(6800, 0.1)).toEqual(6120);
        }); 

    })
    describe("test price reduction", function() {
        it("should return price with a 0% reduction", function() {
            expect(PromoCodeController.calculateReduction(6800, 0)).toEqual(6800);
        });
    })
    
})

describe("Testing Server Response for Pricing", () => {    
    describe("GET none existing URL /", function() {
        it("should return error 404", async () => {
            const {status} = await request(app).get("/")
            expect(status).toEqual(404)
        }); 
    })
    describe("GET /pricing/", function() {
        it("should return the sentence Pricing Service", async () => {
            const {status, text} = await request(app).get("/pricing")
            expect(status).toEqual(200)
            expect(text).toEqual("Pricing Service")
        }); 
    })
    describe("GET /pricing/getPenalties/:id", function() {
        it("should return the sentence Pricing Service", async () => {
            spyOn(RentalPenalty, "find").and.returnValues(await 
                new Promise<any>((resolve, _reject) => resolve([
                    {
                        idPenalty: 1,
                        idRental: 1
                    }
                ]
            )));
            spyOn(Penalty, "findOne").and.returnValue( await 
                new Promise<any>((resolve, _reject) => resolve(
                    {
                        idPenalty: 1,
                        penaltyTotal: 400
                    }
            )));
            const {status, text} = await request(app).get("/pricing/getPenalties/1")
            expect(status).toEqual(200)
            expect(text).toEqual(JSON.stringify(
                {
                    price:  400,
                    msg: "Total pricing of penalties"
                }
            ))
        }); 
    })
    
})



