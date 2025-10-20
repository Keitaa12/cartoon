import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { User } from "src/common/database/entities/user.entity";
import { UserRoleEnum } from "src/common/enums/user-role.enum";

@Injectable()
export class SeedService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seed() {
    await this.seedAdmins();
  }

  async seedAdmins() {
    const admins = [
      {
        email: "admin@gmail.com",
        last_name: "Konaté",
        first_name: "Souleymane",
        role: UserRoleEnum.ADMIN,
      },
    ];
    for (const a of admins) {
      const exist = await this.userRepo.findOneBy({ email: a.email });
      if (!exist)
        await this.userRepo.save({
          ...a,
          password: bcrypt.hashSync("@dmin123", 10),
        });
    }
    return await this.userRepo.find();
  }
}
