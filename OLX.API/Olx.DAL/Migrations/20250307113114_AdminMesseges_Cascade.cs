using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Olx.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AdminMesseges_Cascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_AdminMessages_AspNetUsers_UserId",
                table: "tbl_AdminMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_AdminMessages_AspNetUsers_UserId",
                table: "tbl_AdminMessages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_AdminMessages_AspNetUsers_UserId",
                table: "tbl_AdminMessages");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_AdminMessages_AspNetUsers_UserId",
                table: "tbl_AdminMessages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
