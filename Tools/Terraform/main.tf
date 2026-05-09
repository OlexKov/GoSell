// Provider
provider "aws" {
  region     = "eu-north-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

// Create ec2 instance
resource "aws_instance" "Jenkins_Master" {
  availability_zone      = var.a-zone
  ami                    = var.ami-id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.DefaultTerraformSG.id]

  // Create main disk
  ebs_block_device {
    device_name = "/dev/sda1"
    volume_size = 10
    volume_type = "gp2"
    tags = {
      "name" = "root disk"
    }
  }

  // Tags
  tags = {
    Name = "Jenkins_Master"
  }

  # // User data script
  # user_data = file("files/install_jenkins.sh")
}


// Create security group
resource "aws_security_group" "DefaultTerraformSG" {
  name        = "DefaultTerraformSG"
  description = "Allow 22 inbound traffic"
}

// Define the ingress rules
resource "aws_security_group_rule" "ingress_rules" {
  for_each = {
    "ssh"     = { from_port = 22, to_port = 22, description = "Allow SSH" }
    "http"    = { from_port = 80, to_port = 80, description = "Allow HTTP" }
    "jenkins" = { from_port = 8080, to_port = 8080, description = "Allow Jenkins" }
  }

  type              = "ingress"
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.DefaultTerraformSG.id
  description       = each.value.description
}

// Define the egress rule
resource "aws_security_group_rule" "egress_rule" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.DefaultTerraformSG.id
}
