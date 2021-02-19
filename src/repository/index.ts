import userRepository from "@/repository/userRepository";
import eventRepository from "@/repository/eventRepository";

const v2Repositories = {
  user: userRepository,
  event: eventRepository,
};

export const repository = {
  v2: v2Repositories,
};
