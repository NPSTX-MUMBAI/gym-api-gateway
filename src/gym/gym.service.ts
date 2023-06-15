import { Neo4jService } from '@brakebein/nest-neo4j';

import {
  HttpException,
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Neo4jTypeInterceptor } from 'nest-neo4j/dist';
import { stringify } from 'querystring';
import { SignUpDTO } from 'src/auth/dtos/signup.dto';
import { CreateBankDto } from 'src/bank/dto/create-bank.dto';
// import { AssociateSvcDto } from 'src/services/dto/associateService.dto';
// import { ServiceDTO } from 'src/services/dto/service.dto';
import { CreateGymDto } from './dto/create-gym.dto';
import { serviceCardDTO } from './dto/servicecard.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Gym } from './entities/gym.entity';

@Injectable()
export class GymService {
  constructor(private neo: Neo4jService) {}

  // async create(dto:CreateGymDto,svcDto:AssociateSvcDto) {

  //   try {
  //     let gymId:string;
  //     let userId:string;

  //     //1
  //     const createGym = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
  //         email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
  //         MERGE (a:Address {line1:"${dto.address.line1}",
  //           line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //           city:"${dto.address.city}",state:"${dto.address.state}",
  //           country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //           MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //        `)

  //     if(createGym.length > 0) {
  //         createGym.map((res) => {
  //           gymId = res.g.gymId
  //           console.log('Gym ID ',gymId);

  //       })

  //       //2
  //       const linkMember = await this.neo.write(`
  //       MATCH (g:Gym {gymId:"${gymId}"}),(u:User {userId:"${dto.userId}"})
  //       MERGE (g) - [r:HAS_MEMBER] -> (u)
  //       RETURN type(r)
  //       `)

  //       linkMember.map((res) => {
  //         userId = res.u.userId;
  //         console.log("User ID - ",userId);

  //       })

  //       //3
  //       // svcDto.services.map((service) => {
  //       //   const res = this.neo.write(`
  //       //     MATCH (g:Gym {gymId:"${gymId}"}),(s:Service {svcId:"${svcDto.svcId}"})
  //       //     MERGE (g) - [:HAS_SERVICE  {createdDate:"${Date.now()}",
  //       //     rate:"${service.rate}"
  //       //   }] -> (s)
  //       //   return g
  //       //   `).then((res) => {
  //       //     console.log('Service added - ',res);

  //       //   })
  //       // })

  //     }
  //   } catch (error) {
  //     console.log('',error);

  //   }
  // }

  // async create(dto:CreateGymDto,svcDto:AssociateSvcDto) {

  //   try {
  //     let gymId:string;
  //     let userId:string;

  //     //1
  //     const createGym = await this.neo.write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
  //         email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}"})
  //         MERGE (a:Address {line1:"${dto.address.line1}",
  //           line2:"${dto.address.line2}", locality:"${dto.address.locality}",
  //           city:"${dto.address.city}",state:"${dto.address.state}",
  //           country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
  //           MERGE (g)-[r:LOCATED_IN]->(a) return a,g
  //        `)

  //     if(createGym.length > 0) {
  //         createGym.map((res) => {
  //           gymId = res.g.gymId
  //           console.log('Gym ID ',gymId);

  //       })

  //       //2
  //       const linkMember = await this.neo.write(`
  //       MATCH (g:Gym {gymId:"${gymId}"}),(u:User {userId:"${dto.userId}"})
  //       MERGE (g) - [r:HAS_MEMBER] -> (u)
  //       RETURN type(r)
  //       `)

  //       linkMember.map((res) => {
  //         userId = res.u.userId;
  //         console.log("User ID - ",userId);

  //       })

  //       //3
  //       // svcDto.services.map((service) => {
  //       //   const res = this.neo.write(`
  //       //     MATCH (g:Gym {gymId:"${gymId}"}),(s:Service {svcId:"${svcDto.svcId}"})
  //       //     MERGE (g) - [:HAS_SERVICE  {createdDate:"${Date.now()}",
  //       //     rate:"${service.rate}"
  //       //   }] -> (s)
  //       //   return g
  //       //   `).then((res) => {
  //       //     console.log('Service added - ',res);

  //       //   })
  //       // })

  //     }
  //   } catch (error) {
  //     console.log('',error);

  //   }
  // }

  async create(dto: CreateGymDto) {
    try {
      //step1: first check if the gym exists
      const gymExists = await this.neo
        .read(`MATCH (u:User {userId:"${dto.userId}"})-[o:OWNS]->(g:Gym ) WHERE g.name="${dto.name}" AND g.email="${dto.email}"
     AND g.gstNo="${dto.gstNo}" AND g.aadhar="${dto.aadhar}" return g `);
      console.log('gym=>', gymExists);

      if (gymExists.length > 0) {
        throw new ConflictException(
          'gym exists with the same name for the same user',
        );
      } else {
        let gymId: string;
        const res = await this.neo
          .write(`CREATE (g:Gym { gymId: apoc.create.uuid() ,name:"${dto.name}",
     email:"${dto.email}",panNo:"${dto.panNo}",gstNo:"${dto.gstNo}",aadhar:"${dto.aadhar}",userId:"${dto.userId}"})
     MERGE (a:Address {line1:"${dto.address.line1}",
     line2:"${dto.address.line2}", locality:"${dto.address.locality}",
     city:"${dto.address.city}",state:"${dto.address.state}",
     country:"${dto.address.country}",pinCode:"${dto.address.pinCode}"})
     MERGE (g)-[r:LOCATED_IN]->(a) return a,g
     `);
        console.log(res, 'my gymm');
        res.map((r) => (gymId = r.g.gymId));
        console.log('ID->', gymId);

        if (res) {
          const r = await this.neo.write(`MATCH (u:User
        {userId:"${dto.userId}"}),(g:Gym {gymId:"${gymId}"})
        merge (u)-[o:OWNS {createdOn:"${Date.now()}"}]->(g) return o`);

          console.log('gym created successfully', r);
          return 'gym created successfully';
        } else {
          return 'failed to create gym due to invalid request';
        }
      }
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 501);
    }
  }

  async addOwner(dto: CreateGymDto) {
    try {
      //1
      const checkOwner = await this.neo.read(`
        MATCH (u:User {userId:"${dto.userId}"}) - [:OWNS] - (g:Gym {gymId:"${dto.gymId}"})
        return u
        `);

      if (checkOwner.length > 0) {
        return 'This Gym is Already Owned.';
      } else {
        const linkOwner = this.neo.write(`
          MATCH p=(u:User {userId:"${dto.userId}"}),(g:Gym {gymId:"${dto.gymId}"})
          CREATE (u) - [r:OWNS] -> (g)
          RETURN p
          `);
        return linkOwner;
      }
    } catch (error) {}
  }

  async addMember(dto:CreateGymDto) {
    try {
      const check = await this.neo.read(`
      MATCH p = (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_MEMBER] - (u:User {userId:"${dto.userId}"})
      RETURN p
      `)

      if(check.length > 0) {
        console.log('This member is Already Present in Gym');
        return 'This member is Already Present in Gym';
      } else {
        
        const addMember = this.neo.write(`
        MATCH p = (g:Gym {gymId:"${dto.gymId}"}),(u:User {userId:"${dto.userId}"})
        CREATE (g) - [:HAS_MEMBER] -> (u)
        RETURN p
        `)
        return 'This Member Added Successfully!'
      }'Attaching Service Successfully!'

    } catch (error) {
      throw new NotFoundException('');
    }
  }


  async addBank(dto:CreateBankDto) {
    try {
      const check = await this.neo.read(`
      MATCH p = (g:Gym {gymId:"${dto.gymId}"}),(b:Bank {bankId:"${dto.bankId}"})
      RETURN p
      `)

      if(check.length > 0) {
        console.log('Already Bank is Linked With This Gym');
        return 'Already Bank is Linked With This Gym'
      } else {
        const linkGym = this.neo.write(`
        MATCH p = (g:Gym {gymId:"${dto.gymId}"}),(b:Bank {bankId:"${dto.bankId}"})
        CREATE (g) - [:HAS_ACCOUNT] -> (b)
        RETURN p
        `)
        return linkGym;
      }

    } catch (error) {
      
    }
  }
  



  async findAll() {
    try {
      const res = await this.neo.read(`MATCH (g:Gym) return g`);
      const gyms: Gym[] = [];
      res.map((r) => {
        gyms.push(r.g);
      });
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  async getGymAddress(gymId: string) {
    try {
      const res2 = this.neo.read(`
      MATCH (g:Gym),(a:Address) WHERE g.id=$id and  
      `);

      const res = await this.neo.read(
        `MATCH (g:Gym {gymId:"${gymId}"})
        return g;`,
        { id: gymId },
      );
      const gyms: Gym[] = [];
      res.map((r) => gyms.push(r.g));
      return gyms;
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }

  // async getGymAddress(id: string) {
  //   try {
  //     const res = await this.neo.read(
  //       `MATCH (g:Gym) where g.id=$id return g;`,
  //       { id: id },
  //     );
  //     const gyms: Gym[] = [];
  //     res.map((r) => gyms.push(r.g));
  //     return gyms;
  //   } catch (error) {
  //     throw new HttpException('error encountered', error);
  //   }
  // }

  // async findOne(id: string) {
  //   try {
  //     const res = await this.neo.read(
  //       `MATCH (g:Gym) WHERE g.gymId=$id return g`,
  //       { id: id },
  //     );
  //     let gym: Gym;
  //     console.log(res);
  //     if (res && res.length > 0) {
  //       res.map((r) =>
  //       (gym = r.g));
  //       console.log("GymIDwise details - ",gym);

  //       return gym;
  //     } else {
  //       return null;
  //       //throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' });
  //     }

  //   } catch (error) {
  //     throw new HttpException('error encountered', error);
  //   }
  // }

  async findById(id: String) {
    const gymDetails = await this.neo.read(`
    MATCH (g:Gym{id:"${id}"}) RETURN g as gym;
    `);
    console.log('In Gym -', gymDetails);

    return gymDetails;
  }

  getGymdetailsByBankID(bankId: string) {
    let getDetails = this.neo.read(`
    MATCH (b:Bank {bankId:"${bankId}"}) - [a:HAS_ACCOUNT] - (g:Gym )
    RETURN g
    `);

    return getDetails;
  }

  // Gym <-> Service

  attachSvc(dto: CreateGymDto) {
    console.log('Attaching Service start...');

    const w1 = this.neo.write(`
        MATCH (g:Gym {gymId:"${dto.gymId}"}),(s:Service {svcId:"${dto.svcId}"})
        CREATE (g) - [:HAS_SERVICE {rate:"${dto.rate}"}] -> (s)
        RETURN g;
        `);
        console.log('Attaching Service Successfully!');
    return 'Attaching Service Successfully!'
  }

  detachSvc(dto: CreateGymDto) {
    try {
      console.log('Detaching Service start...');

      const selectService = this.neo
        .read(
          `
      MATCH (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"}) 
      RETURN g
      `,
        )
        .then((res) => {
          const w1 = this.neo.write(`
        MATCH (g:Gym {gymId:"${dto.gymId}"}) - [:HAS_SERVICE] - (s:Service {svcId:"${dto.svcId}"}) 
        DETACH DELETE s;

        `);
        });
      console.log('Service Detached Successfully!');
      return 'Attaching Service Successfully!'

    } catch (error) {
      console.log('Detach unsuccessful! Try Again', error);
      return 'Detach unsuccessful! Try Again';
    }
  }
  

  // async addCustomService(svcDto: ServiceDTO) {
  //   let svcId: string;

  //   const createSvc = await this.neo.write(`
  //     CREATE (s:Service {
  //       svcId:apoc.create.uuid(),
  //       name : "${svcDto.name}",
  //        isDefault: "${svcDto.isDefault}",
  //        svcType: "${svcDto.serviceType}",
  //        isActive:"${svcDto.isActive}",
  //        createdOn: "${new Date()}"
  //       })
  //       return s
  //       `);
  //   createSvc.map((res) => {
  //     svcId = res.s.svcId;

  //     console.log('Service Created with Service ID ', svcId);
  //     return 'Service Created with Service ID! ';
  //   });

  //   // if (createSvc) {
  //   //   const linkWithGym = this.neo.write(`
  //   //   MATCH (g:Gym {id:"${id}"}),(s:Service {svcId:"${svcId}"})
  //   //   MERGE (g) - [:HAS_SERVICE] -> (s)
  //   //   RETURN g
  //   //   `);
  //   //   console.log('Service is added with Gym ID ', id);

  //   //   return linkWithGym;
  //   // } else {
  //   //   console.log('Something went Wrong! Service Error ');
  //   // }
  // }


  // async update(id: string, dto: UpdateGymDto) {
  //   try {
  //     const res = await this.neo.write(`MATCH (g:Gym) where g.id="${id}"
  //     SET
  //     g.name="${dto.name}",
  //     g.email="${dto.email}",
  //     g.panNo="${dto.panNo}",
  //     g.aadhar="${dto.aadhar}"
  //     return g
  //     `);
  //     return 'Gym updated successfully';
  //   } catch (error) {
  //     throw new HttpException('error updating gym', error);
  //   }
  // }

  async update(id: string, dto: UpdateGymDto) {
    try {
      const r1 = this.neo.read(`
      MATCH (g:Gym {id:"${id}"}) 
      RETURN g
      `);
      if (r1) {
        const res = await this.neo.write(`MATCH (g:Gym) where g.id="${id}" 
        SET
        g.name="${dto.name}",
        g.email="${dto.email}",
        g.panNo="${dto.panNo}",
        g.aadhar="${dto.aadhar}"
        return g
        `);
      }
      return 'Gym updated successfully';
    } catch (error) {
      throw new HttpException('error updating gym', error);
    }
  }

  async updateAddress(id: string, dto: UpdateGymDto) {
    try {
      const res = await this.neo
        .write(`MATCH (g:Gym {id:"${id}"})-[r:LOCATED_IN]->(a:Address)
      SET
      a.line1="${dto.address.line1}",
      a.line2="${dto.address.line2}",
      a.locality="${dto.address.locality}",
      a.city="${dto.address.city}",
      a.state="${dto.address.state}",
      a.country="${dto.address.country}",
      a.pinCode="${dto.address.pinCode}"
      return a
      `);
      console.log(res);
      return 'gym address updated successfully';
    } catch (error) {
      console.log(error);
      throw new HttpException('error updating gym', error);
    }
  }

  remove(id: string) {
    console.log('Deleting Gym ID Is', id);

    const w1 = this.neo.write(`
    MATCH (g:Gym {gymId:"${id}"}) 
    DETACH DELETE g
    `);
    console.log('Deleted Gym ID Is - ', id);
    return 'Deleted Gym Successfully! ';
  }

  getGymSvcList(dto: CreateGymDto) {
    try {
      const gymList = this.neo
        .read(
          `
      MATCH (g:Gym {gymId:"${dto.gymId}"})
      RETRURN g
      `,
        )
        .then((res) => {
          console.log('=======', res);
        });
      return gymList;
    } catch (error) {}
  }

  async findAllGymForCurrentUser(userId: string) {
    try {
      console.log(userId);

      const res = await this.neo.read(
        `MATCH (u:User {userId:"${userId}"})-[:OWNS]->(g:Gym) 
          with g
          MATCH (g) - [r:LOCATED_IN] -> (a:Address) 
          return g,a;`,
        { userId: userId },
      );
      const gyms: Gym[] = [];
      res.map((r) => {
        gyms.push({ ...r['g'], address: r['a'] });
        return gyms;
      });
    } catch (error) {
      throw new HttpException('error encountered', error);
    }
  }


  // async createServiceCard(dto:serviceCardDTO) {
  //   try {
      
  //     //Get Gym Service List
  //     const getGymSvcList = await this.neo.read(`
  //     MATCH p = g:Gym {gymId:"${dto.gymId}"} - (s:Service {svcId:"${dto.svcId}"})
  //     RETURN p
  //     `)

  //     if(getGymSvcList.length > 0) {
  //       this.neo.write(`
  //       CREATE (u:User {userId:"${dto.userId}"}) - [] - ()
  //       `)
  //     }


  //   } catch (error) {
      
  //   }
  // }









  // async createServiceCard(dto:serviceCardDTO) {
  //   try {
      
  //         //Get Gym Service List
  //     const getGymSvcList = await this.neo.read(`
  //     MATCH g:Gym {gymId:"${dto.gymId}"} - (s:Service {svcId:"${dto.svcId}"})
  //     RETURN s
  //     `)


  //     if(getGymSvcList.length > 0) {
  //       this.neo.write(`
  //       MATCH (u:User {userId:"${dto.userId}"}),(sc:serviceCard:"${dto.svcCardID}")
  //       CREATE (u) - [] - (sc)
  //       `)
  //     }


  //   } catch (error) {
      
  //   }
  // }


  //1
  async createServiceCard(dto:serviceCardDTO) {
    try {

      let svcCardId : string;

      const createSvcCard = await this.neo.write(`
      CREATE (sc:ServiceCard {
        svcCardId:apoc.create.uuid(),
        svcName:"${dto.svcName}",
        svcStartDate:"${dto.svcStartDate}",
        svcEndDate::"${dto.svcEndDate}"
      })
      return sc
      `)


      createSvcCard.map((res) => {
        svcCardId = res.sc.svcCardID;
        console.log("Svc Card Is ",svcCardId);
        
      })


      //Attaching Service card to the the Member

      const attachSvcCard = this.neo.read(`
      MATCH p = u:User {userId:"${dto.userId}"} - [:HAS_SERVICECARD] - (s:serviceCard:${svcCardId})
      RETURN p

      `)
      

      //Check If User has Servic Card

      // const getGymSvcList = await this.neo.read(`
      // MATCH u:User {userId:"${dto.userId}"} - (s:serviceCard {svcId:"${dto.svcCardID}"})
      // RETURN s
      // `)


    } catch (error) {
      
    }
  }



  assignServiceCardToMember(dto:serviceCardDTO) {
    try {

      let svcCardId:string;

      const attachSvcCard = this.neo.read(`
      MATCH p = u:User {userId:"${dto.userId}"} - [:HAS_SERVICECARD] - (s:serviceCard:${dto.svcCardID})
      RETURN p

      `)
      

    } catch (error) {
      throw new HttpException('User or ServiceCard Not Found',404);
    }
  }

  // getServiceCard() {
  //   //Get from Gym  

  //   try {
  //     this.neo.read(`
  //     MATCH (sc:serviceCard {svcCardId:"${}"})
  //     return sc
  //     `)
  //   } catch (error) {
      
  //   }

  // }




}
