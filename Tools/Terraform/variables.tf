variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

variable "regios" {
  type    = string
  default = "eu-north-1"
}

variable "a-zone" {
  type    = string
  default = "eu-north-1a"
}

variable "ami-id" {
  type = string
  # default = "ami-0fa91bc90632c73c9"
  default = "ami-05d62b9bc5a6ca605"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_name" {
  type    = string
  default = "Stockholm_2"
}
