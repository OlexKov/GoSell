using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Add_MessageLogo_value_to_AdminMessage_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MessageLogo",
                table: "tbl_AdminMessages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MessageLogo",
                table: "tbl_AdminMessages");
        }
    }
}
