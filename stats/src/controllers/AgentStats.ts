import { Request, Response } from "express";
import { getManager} from "typeorm";
import { Agent } from "../entity/Agent";

export async function AgentRepByDay(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`*`)
    .from(`( SELECT h.day,h."idUser" as id , h."lastName" || ' ' || h."firstName" as fullname, count(r."dateReparationPanne") as reparations FROM ((SELECT generate_series(
        date_trunc('year', now()),
        now(),
        '1 day'
        )::DATE AS day ) g cross join "User" v ) h 
        LEFT JOIN "Panne" r on r."idAgentTreatPanne"=h."idUser" and r."dateReparationPanne"=h.day
        where h."userType" = 'agent'
        group by h.day,h."idUser"
        order by h.day )`,"V")
    .where(`"V".id=:id`,{id: _req.params.id})
    .getRawMany();
    res.json(qur);
}

export async function AgentRepByWeek(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`*`)
    .from(`( SELECT h.week,h."idUser" as id , h."lastName" || ' ' || h."firstName" as fullname, count(r."dateReparationPanne") as reparations 
            FROM ((SELECT TO_CHAR(generate_series(
            date_trunc('year', now()),
            now(),
            '1 week'
            )::DATE,'WW') as week ) g cross join "User" v ) h 
            LEFT JOIN "Panne" r on r."idAgentTreatPanne"=h."idUser" and TO_CHAR(r."dateReparationPanne",'WW')=h.week
            where h."userType" = 'agent'
            group by h.week,h."idUser"
            order by h.week )`,"V")
    .where(`"V".id=:id`,{id: _req.params.id})
    .getRawMany();
    res.json(qur);
}

export async function AgentRepByMonth(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`*`)
    .from(`( SELECT h.month,h."idUser" as id , h."lastName" || ' ' || h."firstName" as fullname, count(r."dateReparationPanne") as reparations 
            FROM ((SELECT TO_CHAR(generate_series(
            date_trunc('year', now()),
            now(),
            '1 month'
            ),'Mon') as month ) g cross join "User" v ) h 
            LEFT JOIN "Panne" r on r."idAgentTreatPanne"=h."idUser" and TO_CHAR(r."dateReparationPanne",'Mon')=h.month
            where h."userType" = 'agent'
            group by h.month,h."idUser"
            order by to_date(h.month,'Mon') )`,"V")
    .where(`"V".id=:id`,{id: _req.params.id})
    .getRawMany();
    res.json(qur);
}


export async function AgentRepByYear(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`*`)
    .from(`( SELECT h.year,h."idUser" as id , h."lastName" || ' ' || h."firstName" as fullname, count(r."dateReparationPanne") as reparations 
            FROM ((SELECT EXTRACT(YEAR FROM 
            generate_series(
            now() - INTERVAL '5 years',
            now(),
            '1 year'
            )) as year ) g cross join "User" v ) h 
            LEFT JOIN "Panne" r on r."idAgentTreatPanne"=h."idUser" and extract(year from r."dateReparationPanne")=h.year
            where h."userType" = 'agent'
            group by h.year,h."idUser"
            order by h.year )`,"V")
    .where(`"V".id=:id`,{id: _req.params.id})
    .getRawMany();
    res.json(qur);
}




export async function AgentReparation(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`"idAgent" `)
    .addSelect(`count("idAgentTreatPanne") as "Reparation"`)
    .from(Agent,"agent")
    .leftJoin("Panne", "panne", `panne."idAgentTreatPanne" = agent."idAgent"`)
    .groupBy(`"idAgent"`)
    .getRawMany();
    res.json(qur);
}

export async function AgentReparationDate(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`"idAgent" `)
    .addSelect(`count("idAgentTreatPanne") as "Reparation"`)
    .from(Agent,"agent")
    .leftJoin("Panne", "panne", `panne."idAgentTreatPanne" = agent."idAgent" AND panne."dateReparationPanne" BETWEEN :start AND :end`,{start:_req.params.start, end:_req.params.end})
    .groupBy(`"idAgent"`)
    .getRawMany();
    res.json(qur);
}



export async function AgentReparationById(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`"idAgent" `)
    .addSelect(`count("idAgentTreatPanne") as "Reparation"`)
    .from(Agent,"agent")
    .leftJoin("Panne", "panne", `panne."idAgentTreatPanne" = agent."idAgent"`)
    .where(`"idAgent"=:id`,{id: _req.params.id})
    .groupBy(`"idAgent"`)
    .getRawOne();
    res.json(qur);
}

export async function AgentReparationDateById(_req: Request, res: Response) {
    const qur = await getManager()
    .createQueryBuilder()
    .select(`"idAgent" `)
    .addSelect(`count("idAgentTreatPanne") as "Reparation"`)
    .from(Agent,"agent")
    .leftJoin("Panne", "panne", `panne."idAgentTreatPanne" = agent."idAgent" AND panne."dateReparationPanne" BETWEEN :start AND :end`,{start:_req.params.start, end:_req.params.end})
    .where(`"idAgent"=:id`,{id: _req.params.id})
    .groupBy(`"idAgent"`)
    .getRawMany();
    res.json(qur);
}


